#!/usr/bin/python3
""" Starts a Flash Web Application """
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from models.review import Review
from models.user import User
from os import environ
from uuid import uuid4
from flask import Flask, render_template
import requests
import json
app = Flask(__name__)
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/hbnb/', strict_slashes=False)
def hbnb():
    """ HBNB is alive! """

    url = "https://jesulayomy.tech/api/v1/"

    states = requests.get(f"{url}states").json()

    states = sorted(states, key=lambda k: k.name)
    st_ct = []

    for state in states:
        st_ct.append([state, sorted(state.cities, key=lambda k: k.name)])

    amenities = requests.get(url + "amenities")
    amenities = sorted(amenities, key=lambda k: k.name)

    return render_template('101-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           cache_id=uuid4())
                            


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5002)
