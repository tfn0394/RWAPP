from datetime import datetime
from unittest import TestCase

from freezegun import freeze_time


def create_db_formatted_date(current_date):
    date_now = current_date
    database_date_format = f'{date_now:%d}-{date_now:%m}-{date_now:%Y} {date_now.hour}'
    return database_date_format

 
class TestDateFormat(TestCase):
    def test_create_db_formatted_date(self):
        with freeze_time("2020-01-01 00:00:00.000000"):
            results = create_db_formatted_date(datetime.now())
            self.assertEqual(results, "01-01-2020 0")

        with freeze_time("2019-02-02 01:39:58.993748"):
            results = create_db_formatted_date(datetime.now())
            self.assertEqual(results, "02-02-2019 1")

        with freeze_time("2000-03-02 02:40:17.524670"):
            results = create_db_formatted_date(datetime.now())
            self.assertEqual(results, "02-03-2000 2")

        with freeze_time("2000-04-02 03:40:37.112799"):
            results = create_db_formatted_date(datetime.now())
            self.assertEqual(results, "02-04-2000 3")

        with freeze_time("2020-05-02 04:00:00.000000"):
            results = create_db_formatted_date(datetime.now())
            self.assertEqual(results, "02-05-2020 4")

        with freeze_time("2020-06-02 05:00:00.000000"):
            results = create_db_formatted_date(datetime.now())
            self.assertEqual(results, "02-06-2020 5")

        with freeze_time("2020-07-02 06:00:00.000000"):
            results = create_db_formatted_date(datetime.now())
            self.assertEqual(results, "02-07-2020 6")

        with freeze_time("2020-08-02 07:00:00.000000"):
            results = create_db_formatted_date(datetime.now())
            self.assertEqual(results, "02-08-2020 7")

        with freeze_time("2020-09-02 08:00:00.000000"):
            results = create_db_formatted_date(datetime.now())
            self.assertEqual(results, "02-09-2020 8")

        with freeze_time("2020-10-02 09:00:00.000000"):
            results = create_db_formatted_date(datetime.now())
            self.assertEqual(results, "02-10-2020 9")

        with freeze_time("2020-11-02 10:00:00.000000"):
            results = create_db_formatted_date(datetime.now())
            self.assertEqual(results, "02-11-2020 10")

        with freeze_time("2020-12-02 11:00:00.000000"):
            results = create_db_formatted_date(datetime.now())
            self.assertEqual(results, "02-12-2020 11")

        with freeze_time("2020-01-01 19:01:32.123271"):
            results = create_db_formatted_date(datetime.now())
            self.assertEqual(results, "01-01-2020 19")

        with freeze_time("2020-10-10 20:44:09"):
            results = create_db_formatted_date(datetime.now())
            self.assertEqual(results, "10-10-2020 20")

        with freeze_time("2021-12-12 22:24:01.564347"):
            results = create_db_formatted_date(datetime.now())
            self.assertEqual(results, "12-12-2021 22")

        with freeze_time("2022-12-31 23:59:59.999999"):
            results = create_db_formatted_date(datetime.now())
            self.assertEqual(results, "31-12-2022 23")
