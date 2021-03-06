from flask import render_template, flash, redirect, abort, session, url_for, request, g, json, Response
from geoalchemy2 import Geometry, func
from geoalchemy2.functions import GenericFunction
from app.models.powerline import Powerline

class PowerlinesController:
    def index(self):
        if request.args.get('bounds') is None:
            return Response(json.dumps([]), mimetype='application/json')
        bounds_parts = request.args.get("bounds").split(',')
        zoom = int(request.args.get("zoom") or 1)

        powerlines = []

        if int(zoom) < 9:
            powerlines = Powerline.query.filter(func.ST_Intersects(func.ST_MakeEnvelope(bounds_parts[1], bounds_parts[0], bounds_parts[3], bounds_parts[2]), Powerline.geom)).filter(func.ST_Length(func.ST_GeographyFromText(func.ST_AsText(Powerline.geom))) > 8000 * (10 - zoom)).all()
        else:
            powerlines = Powerline.query.filter(func.ST_Intersects(func.ST_MakeEnvelope(bounds_parts[1], bounds_parts[0], bounds_parts[3], bounds_parts[2]), Powerline.geom)).all()

        powerlines = list(map(lambda powerline: powerline.serialize(), powerlines))
        return Response(json.dumps(powerlines),  mimetype='application/json')
