# Python Stuff

## Requirements

- [Python 3.9](https://www.python.org/downloads/)
- [Pip](https://pip.pypa.io/en/stable/)
- [Pipenv](https://pipenv.pypa.io/en/latest/)

Make sure you have Python 3.9 & pip

```bash
$ python --version
Python 3.9.7
$ pip --version
pip 21.3 from (python 3.9)
```

You also will need pipenv to get the workflow setup

If you're using Windows:

```bash
python3 -m pip install --upgrade pip setuptools wheel
python3 -m pip install --user virtualenv
python3 -m pip install --user pipenv
```

Upgrading packages:

```bash
python3 -m pip install --user --upgrade virtualenv pipenv pipx
```

## Installing

Clone the repo:

```bash
git clone https://github.com/ZombiePander/R_W_APP.git
```

Change directory to PythonStuff

```bash
cd .\R_W_APP\PythonStuff\
```

Install packages

```bash
pipenv install 
```

If doing **development **you will need the development dependencies:

```bash
pipenv install --dev
```

## Running

Use the shell:

```bash
pipenv shell
```

Make sure to be inside the directory *./PythonStuff* to run pipenv scripts and commands.

```bash
python FinalDataScrape.py
```
### Hortplus MetWatch
To be able to scrape data from Hortplus Metwatch a authentication credential is needed.
Create a secrets.txt under PythonStuff/secrets folder with username and password.

### AUT server
If you are using the AUT server provider when running this script you will have to login to network 
services to access the internet. Otherwise someone needs to restart AUT server ever 14 hours. This file runs alongside 
FilnalDataScrape python file

Create AUTNetwork.txt in secrets folder and put credientals 

```bash
usename:password
```

Make sure to be inside the directory *./PythonStuff* to run pipenv scripts and commands. 

```bash
python scheduler_aut_network.py
``` 



## Getting Started with development

If you are using an Visual Studio Code or PyCharm make sure you setup to use the virtual environment Python interperter created by pipenv.

## Scripts

```bash
pipenv run lint
```

```bash
pipenv run format
```

```bash
pipenv run format-docs
```

## Formatting

What json should look like. Keys and Values.

```json
[
  {
    "Date": "Sat 21st Aug 2021",
    "Time": "1 - 2pm",
    "Temp": 11.6,
    "Rainfall (mm)": 0.4,
    "Leaf Wetness (%)": 98.2,
    "Relative Humidity (%)": 96.6,
    "Wind Speed (kmh)": 2.9,
    "Wind Direction": "E",
    "Spray Drift Risk": "Not Recommended",
    "Backup Data": null,
    "Missing Data": "\r\n"
  }
]
```

pip install Pyrebase4
