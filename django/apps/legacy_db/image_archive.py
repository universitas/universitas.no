# -*- coding: utf-8 -*-
# pylint: disable=logging-format-interpolation

import re

from django.utils.text import slugify
from django.utils.timezone import datetime

import logging
logger = logging.getLogger(__name__)


class ImageFile(object):

    issue = None

    def __init__(self, fullpath, filesize, filedate, issue, year):
        self.created_date = filedate
        self.year = int(year)
        self.issue = int(issue)
        self.path = fullpath
        self.filename = fullpath.split('/')[-1]
        self._slugify_filename()
        # logger.debug(self._slugify_filename())

    def _slugify_filename(self):
        filename, dot, extension = self.filename.rpartition('.')
        filename = re.sub(r'[\s_–.]+', '-', filename)
        filename = re.sub(r'^[\d-]*', '', filename)
        filename = slugify(filename)
        if filename == "":
            logger.debug(self.path)
        year = self.year
        issue = self.issue
        extension = extension.lower()
        if extension == "jpeg":
            extension = "jpg"
        better_filename = '{}-{:0>2}-{}.{}'.format(
            year,
            issue,
            filename,
            extension,
        )
        return better_filename

    def _add_path(self, newpath):
        if newpath not in self.paths:
            self.paths.append(newpath)


def main():
    with open('bildeliste2') as f:
        images = f.readlines()
    # matchvalue = None
    # shuffle(images)
    # images = images[:100]
    imagedict = {}
    duplicates = 0
    for img in images:
        if re.search('/(reklame|banner|elm|2014/2013|slettmeg)/', img):
            continue
        year = issue = None
        fields = img.split()
        filesize_in_bytes = int(fields[0])
        unix_timestamp = int(fields[5])
        filedate = datetime.fromtimestamp(unix_timestamp)
        filepath = ''.join(fields[6:])
        filename = filepath.split('/')[-1]
        # logger.debug("{} {} {}".format(size, unix_timestamp, path))
        year_issue_match = (
            re.match(
                r'\./(?P<year>\d{4})/(?P<issue>\d{1,2})/(?P=issue)\D',
                filepath) or re.match(
                r'\./(?P<year>\d{4})/(?P<issue>\d{1,2})/',
                filepath) or re.match(
                r'\./(?P<year>\d{4})/(?P<issue>\d{2})[^\d/]',
                filepath) or None)
        if year_issue_match:
            # matchvalue = 1
            year = year_issue_match.group('year')
            issue = year_issue_match.group('issue')
        else:
            issue_match = re.search(r'\/(?P<issue>\d{2})[^/\d]', filepath)
            if issue_match:
                # matchvalue = 2
                issue = issue_match.group('issue')
                year = filedate.year
            else:
                # matchvalue = 3
                year = filedate.year
                issue = '00'

        # logger.debug('year: {}, issue: {}, file: {}'.format(issuematch.group('year'), issuematch.group('issue'), filename))
        if year and issue:
            image_file = ImageFile(
                filepath,
                filesize_in_bytes,
                filedate,
                issue,
                year)
            if filename in imagedict:
                # old_filepath = imagedict[filename]
                duplicates += 1
            else:
                imagedict[filename] = image_file
        else:
            msg = 'No match {}'.format(filepath)
            logger.debug(msg)

    msg = 'all: {0} placed: {1} duplicates: {2}'.format(
        len(images), len(imagedict), duplicates)
    logger.debug(msg)

if __name__ == '__main__':
    main()
