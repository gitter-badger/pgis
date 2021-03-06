from flask import render_template, flash, redirect, abort, session, url_for, request, g, json, Response
from app import db
import app.helpers.point_form
from app.models.point import Point
from app.models.submission import Submission
from geoalchemy2 import Geometry, func
from flask.ext.login import current_user

class SubmissionsController:
    def index(self):
        page = int(request.args.get('page') or 1) 
        submissions = Submission.query.paginate(page, 20)
        return render_template('admin/submissions/index.html', submissions=submissions)

    def revise(self, id):
        submission = Submission.query.get(id)
        return render_template('admin/submissions/revise.html', submission=submission)

    def merge(self, id):
        pass

    def delete(self, id):
        point = Point.query.get(id)
        db.session.delete(point)
        db.session.commit()
        return redirect(url_for('admin_points'))
