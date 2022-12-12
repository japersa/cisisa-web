import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

class ForgotPassword extends Component {
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
                  <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-2">¿Has olvidado tu contraseña?</h1>
                    <p class="mb-4">We get it, stuff happens. Just enter your email address below
                      and we'll send you a link to reset your password!</p>
                  </div>
                  <form className="user">
                    <div className="form-group">
                      <input type="email" className="form-control form-control-user" id="exampleInputEmail" placeholder="Enter Email Address..." />
                    </div>
                    <Link className="btn btn-primary btn-user btn-block" to="/">   Restablecer la contraseña</Link>
                  </form>
                  <hr />
                  <div className="text-center">
                    <Link className="small" to="/signup">¡Crea una cuenta!</Link>
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

export default withRouter(ForgotPassword);