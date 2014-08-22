# Based on http://stackoverflow.com/a/5809952/689985

# from django.test.simple import DjangoTestSuiteRunner
# from django.test.simple import dependency_ordered
from discover_runner import DiscoverRunner

class ByPassableDBDjangoTestSuiteRunner(DiscoverRunner):
    def setup_databases(self, **kwargs):
        from django.db import connections, DEFAULT_DB_ALIAS

        # First pass -- work out which databases actually need to be created,
        # and which ones are test mirrors or duplicate entries in DATABASES
        mirrored_aliases = {}
        test_databases = {}
        dependencies = {}
        for alias in connections:
            connection = connections[alias]
            if connection.settings_dict['TEST_MIRROR']:
                # If the database is marked as a test mirror, save
                # the alias.
                mirrored_aliases[alias] = connection.settings_dict['TEST_MIRROR']
            else:
                # Store a tuple with DB parameters that uniquely identify it.
                # If we have two aliases with the same values for that tuple,
                # we only need to create the test database once.
                item = test_databases.setdefault(
                    connection.creation.test_db_signature(),
                    (connection.settings_dict['NAME'], [])
                )
                item[1].append(alias)

                if 'TEST_DEPENDENCIES' in connection.settings_dict:
                    dependencies[alias] = connection.settings_dict['TEST_DEPENDENCIES']
                else:
                    if alias != DEFAULT_DB_ALIAS:
                        dependencies[alias] = connection.settings_dict.get('TEST_DEPENDENCIES', [DEFAULT_DB_ALIAS])

        # Second pass -- actually create the databases.
        old_names = []
        mirrors = []
        for signature, (db_name, aliases) in (test_databases.items(), dependencies):
            # Actually create the database for the first connection
            connection = connections[aliases[0]]
            if connection.settings_dict.get("USE_LIVE_FOR_TESTS"):
                continue

            old_names.append((connection, db_name, True))

            test_db_name = connection.creation.create_test_db(self.verbosity, autoclobber=not self.interactive)
            for alias in aliases[1:]:
                connection = connections[alias]
                if db_name:
                    old_names.append((connection, db_name, False))
                    connection.settings_dict['NAME'] = test_db_name
                else:
                    # If settings_dict['NAME'] isn't defined, we have a backend where
                    # the name isn't important -- e.g., SQLite, which uses :memory:.
                    # Force create the database instead of assuming it's a duplicate.
                    old_names.append((connection, db_name, True))
                    connection.creation.create_test_db(self.verbosity, autoclobber=not self.interactive)

        for alias, mirror_alias in mirrored_aliases.items():
            mirrors.append((alias, connections[alias].settings_dict['NAME']))
            connections[alias].settings_dict['NAME'] = connections[mirror_alias].settings_dict['NAME']

        return old_names, mirrors

    def teardown_databases(self, old_config, **kwargs):
        from django.db import connections
        old_names, mirrors = old_config
        # Point all the mirrors back to the originals
        for alias, old_name in mirrors:
            connections[alias].settings_dict['NAME'] = old_name
        # Destroy all the non-mirror databases
        for connection, old_name, destroy in old_names:
            if destroy:
                connection.creation.destroy_test_db(old_name, self.verbosity)
            else:
                connection.settings_dict['NAME'] = old_name
