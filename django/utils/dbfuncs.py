from django.db.models import FloatField, Func, Value


class TrigramWordSimilarity(Func):
    output_field = FloatField()
    function = 'WORD_SIMILARITY'

    def __init__(self, expression, string, **extra):
        if not hasattr(string, 'resolve_expression'):
            string = Value(string)
        super().__init__(string, expression, **extra)


class LogAge(Func):
    """Calculate log 2 of days since datetime column"""
    # Minimum age 1 day. Prevent log of zero error and unintended large
    # effect of log of very small inputs.
    output_field = FloatField()

    template = (
        f'greatest(1.0, log(2::numeric, ('
        'abs(extract(epoch FROM (TIMESTAMP '
        "'%(when)s' - "
        'COALESCE(%(table)s.%(timefield)s,%(table)s.created)'
        '))) / (60 * 60 * 24))::numeric'
        '))'
    )

    # greatest(1.0, log(2, number))
    # return at least 1.0 to avoid zero division or very skewed results
    # for logs close to zero

    # abs(extract(epoch FROM (when - then)))
    # Extract total seconds in timedelta `now - then`
    # `epoch` = 1970-01-01 = unix epoch = total seconds

    # / (60 * 60 * 24)
    # Divide by minutes and seconds and hours: seconds -> days

    # ::numeric
    #  Cast result as `numeric` using PostgreSQL type cast notation
    # `numeric` = decimal type
