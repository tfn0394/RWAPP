from datetime import datetime, timedelta
from time import sleep

from aut_network import AutNetworkService

while True:
    print("||===========================================||")
    print("|| Starting scheduler_aut_network.py...      ||")
    print("|| " + str(datetime.now().strftime("%A, %d %B %Y at %I:%M:%S %p")) + " ||")
    print("|--------------------------------------------|")
    aut = AutNetworkService()
    print("  |------------------------------------------|")
    print("  | Logging out of current session           |")
    print("  |------------------------------------------|")
    aut.test_logout()
    print("  |------------------------------------------|")
    print("  | Logging into new session                 |")
    print("  |------------------------------------------|")
    aut.test_login()
    aut.teardown_method()
    dt = datetime.now() + timedelta(hours=13)
    dt = dt.replace(minute=20)

    print("|--------------------------------------------|")
    print("|| Sleeping...                               ||")
    print("|| Finished at:                              ||")
    print("|| " + str(datetime.now().strftime("%A, %d %B %Y at %I:%M:%S %p")) + " ||")
    print("|| Next session refresh is at:               ||")
    print(dt.strftime("%A, %d %B %Y at %I:%M:%S %p      ||"))
    print("||===========================================|")

    while datetime.now() < dt:
        sleep(1)
