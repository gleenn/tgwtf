import os
from setuptools import setup, find_packages

requires = [
    # Vendored them in so that we don't have to 
    # be online if we have to recompile on the playa
    #'aprslib',
    #'pyserial',
  ]

setup(name='dfaprs',
      version='1.0',
      description='A daemon to feed APRS data into BRCMap server',
      classifiers=[
        "Programming Language :: Python",
        ],
      author='Dmitry Azovtsev',
      author_email='dmitry@azovtsev.com',
      url='http://www.brcmap.org/',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      install_requires=requires,
      #dependency_links = ['-e git+https://github.com/azov/aprs-python.git#egg=aprslib-0.6.37'],
      entry_points="""\
      [console_scripts]
      dfaprs = dfaprs.main:main
      """,
      )
