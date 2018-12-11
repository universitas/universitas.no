from django.db import connection, models
from django.db.models import F, Func, Window


class Days(Func):
    """Cast float field to Interval in days"""
    output_field = models.DurationField()
    template = "to_char(%(expressions)s, 'S9990.0999 \"days\"')::interval"


class Epoch(Func):
    """Get epoch timestamp from date time field """
    output_field = models.FloatField()
    template = "extract(epoch from %(expressions)s) / (60 * 60 * 24)"


adjusted_publication_time = F('story__publication_date') + Days('priority')


def with_epoch(qs):
    return qs.annotate(
        adjusted_time=Epoch(
            adjusted_publication_time, output_field=models.DateTimeField()
        )
    )


class English(Func):
    """Is the language english"""
    output_field = models.BooleanField()
    template = "%(expressions)s = 'en'"


adjusted_order = Window(
    expression=models.functions.RowNumber(),
    partition_by=[English('story__language')],
    order_by=adjusted_publication_time.desc(nulls_last=True)
)


def with_order(qs):
    qs.annotate(new_order=adjusted_order)


def reorder_frontpage():
    """Reorder all stories using window function"""

    RAW_SQL_REORDER = """
    WITH ordered_frontpage AS ( SELECT
      "frontpage_frontpagestory"."id",
      ROW_NUMBER() OVER (
        PARTITION BY "stories_story"."language" = 'en'
        ORDER BY (
          "stories_story"."publication_date"
          + to_char("frontpage_frontpagestory"."priority",
                    'S9990.0999 "days"')::interval) DESC NULLS LAST
        ) AS "ranking"
        FROM "frontpage_frontpagestory"
        INNER JOIN "stories_story" ON (
          "frontpage_frontpagestory"."story_id" = "stories_story"."id")
        WHERE ("frontpage_frontpagestory"."published" = TRUE
          AND "stories_story"."publication_status" IN (10, 11))
    )
    UPDATE "frontpage_frontpagestory"
    SET "order" = "ordered_frontpage"."ranking" FROM "ordered_frontpage"
    WHERE "frontpage_frontpagestory"."id" = "ordered_frontpage"."id";
    """
    with connection.cursor() as cursor:
        cursor.execute(RAW_SQL_REORDER)
