import os 
from flask import Blueprint, request, current_app, jsonify, send_file
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

# blueprint
bp = Blueprint('main', __name__, url_prefix='/api')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/uploadFile/', methods=['POST'])
def upload_file():
    print('upload')
    
    # check if the post request has the file part
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        return 'No Name'
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        print(filename)
        img_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(img_dir)
        return jsonify({'filename': filename})
    else:
        return 'No File'

@bp.route('/images/<filename>', methods=['GET'])
def send_image(filename):
    img_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    if os.path.isfile(img_dir):
        return send_file(img_dir, mimetype='img/png')
    else:
        return 'No File'