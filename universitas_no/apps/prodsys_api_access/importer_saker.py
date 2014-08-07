from prodsys_import.id_liste import SAKER
from stories.models import import_from_prodsys


def main(antall=100, slutt=1):
    til = -1 * slutt
    fra = -1 * (1 + antall - slutt)
    importsaker = SAKER[fra:til]
    import_from_prodsys(importsaker)

if __name__ == '__main__':
    main()