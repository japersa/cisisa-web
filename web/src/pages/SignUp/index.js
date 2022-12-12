import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

class SignUp extends Component {
  render() {
    return (
      <div className="container">

        <div className="card o-hidden border-0 shadow-lg my-5">
          <div className="card-body p-0">
            {/* <!-- Nested Row within Card Body --> */}
            <div className="row">
              <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
              <div className="col-lg-7">
                <div className="p-5">
                  <div className="text-center">
                    <h1 className="h4 text-gray-900 mb-4">¡Crea una cuenta!</h1>
                  </div>
                  <form className="user">
                    <div className="form-group row">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input type="text" className="form-control form-control-user" id="exampleFirstName" placeholder="First Name" />
                      </div>
                      <div className="col-sm-6">
                        <input type="text" className="form-control form-control-user" id="exampleLastName" placeholder="Last Name" />
                      </div>
                    </div>
                    <div className="form-group">
                      <input type="email" className="form-control form-control-user" id="exampleInputEmail" placeholder="Email Address" />
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input type="password" className="form-control form-control-user" id="exampleInputPassword" placeholder="Password" />
                      </div>
                      <div className="col-sm-6">
                        <input type="password" className="form-control form-control-user" id="exampleRepeatPassword" placeholder="Repeat Password" />
                      </div>
                    </div>
                    <Link className="btn btn-primary btn-user btn-block" to="/">Registrar Cuenta</Link>
                  </form>
                  <hr />
                  <div className="text-center">
                    <Link className="small" to="/forgotPassword">¿Has olvidado tu contraseña?</Link>
                  </div>
                  <div className="text-center">
                    <Link className="small" to="/">¿Ya tienes una cuenta? ¡Ingresar!</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default withRouter(SignUp);