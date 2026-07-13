from setuptools import setup, find_packages

setup(
    name="steelflow_db",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "sqlalchemy",
        "alembic",
        "psycopg2-binary",
        "python-dotenv"
    ],
)
