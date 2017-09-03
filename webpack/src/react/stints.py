import re
import pprint


def find_positions(issue):
    positions = ('redaktør', 'desksjef', 'nyhetsleder', 'nettredaktør',
                 'fotosjef', 'debattredaktør', 'magasinredaktør')
    pattern = re.compile(
        r'^(?P<title>\w+):\s(?P<name>[-\w ]+)$', flags=re.M | re.I)
    try:
        content = issue.get_page_text_content(2, 100)
    except Exception as e:
        print(e)
        return {}
    matches = pattern.finditer(content)
    return {
        d['title']: d['name']
        for d in [m.groupdict() for m in matches]
        if d['title'] in positions
    }


def add_to_stint(title, name, date):
    try:
        contributor = Contributor.objects.get(display_name=name)
    except Contributor.DoesNotExist:
        print(f'could not find {name}')
        return
    position, _ = Position.objects.get_or_create(title=title)
    defaults = {'start_date': date, 'end_date': date}
    stint, _ = Stint.objects.get_or_create(
        defaults=defaults, position=position, contributor=contributor)
    stint.end_date = max(stint.end_date, date)
    stint.start_date = min(stint.start_date, date)
    stint.save()


def find_stints_from_pdfs(issues=None):
    if issues is None:
        issues = Issue.objects.all()
    for issue in issues:
        data = find_positions(issue)
    content = issue.get_page_text_content(2, 100)
    print(issue)
    pprint.pprint(data)
    date = issue.issue.publication_date
    for title, name in data.items():
        add_to_stint(title, name, date)
