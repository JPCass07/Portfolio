from flask import Flask, render_template  # <-- include render_template when importing the library

app = Flask(__name__)

# route for homepage
@app.route("/")
def home():
    return render_template("Home.html")  #links to the html reference 

# Project page
@app.route("/project")
def project():
    return render_template("project.html")  # render the new page

if __name__ == "__main__":
    app.run(debug=True)
