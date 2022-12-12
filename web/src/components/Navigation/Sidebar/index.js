import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Show } from "../../../hooks/Show";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clickMenuOpen } from '../../../redux/actions';

class Sidebar extends Component {
  render() {
    const { clickMenuOpen, toggled } = this.props;
    return (
      <ul className={toggled ? 'navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled' : 'navbar-nav bg-gradient-primary sidebar sidebar-dark accordion'} id="accordionSidebar">

        {/* <!-- Sidebar - Brand --> */}
        <div className="sidebar-brand d-flex align-items-center justify-content-center">
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <div className="sidebar-brand-text mx-3">Cisisa</div>
        </div>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider my-0" />

        {/* <!-- Nav Item - Dashboard --> */}
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span></Link>
        </li>

        {/* <!-- Divider --> */}
        <Show when="feature:menu-masters">
          <hr className="sidebar-divider" />
          <div className="sidebar-heading">Configuración</div>
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#collapse1"
              aria-controls="collapse1"
            >
              <i className="fas fa-fw fa-cog"></i>
              <span>Maestros</span>
            </a>
            <div
              id="collapse1"
              className="collapse"
              aria-labelledby="collapse1"
              data-parent="#accordionSidebar"
            >
              <div className="bg-white py-2 collapse-inner rounded">
                <Show when="feature:read-country">
                  <Link className="collapse-item" to="/countries">
                    Paises
                  </Link>
                </Show>
                <Show when="feature:read-department">
                  <Link className="collapse-item" to="/departments">
                    Estados
                  </Link>
                </Show>
                <Show when="feature:read-city">
                  <Link className="collapse-item" to="/cities">
                    Ciudades
                  </Link>
                </Show>
                <Show when="feature:read-neighborhood">
                  <Link className="collapse-item" to="/neighborhoods">
                    Barrios
                  </Link>
                </Show>
              </div>
            </div>
          </li>
        </Show>
        <Show when="feature:menu-security">
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#collapse2"
              aria-controls="collapse2"
            >
              <i className="fas fa-shield-alt"></i>
              <span>Seguridad</span>
            </a>
            <div
              id="collapse2"
              className="collapse"
              aria-labelledby="collapse2"
              data-parent="#accordionSidebar"
            >
              <div className="bg-white py-2 collapse-inner rounded">
                <Show when="feature:read-role">
                  <Link className="collapse-item" to="/roles">
                    Roles
                  </Link>
                </Show>
                <Show when="feature:read-permission">
                  <Link className="collapse-item" to="/permissions">
                    Permisos
                  </Link>
                </Show>
                <Show when="feature:read-user">
                  <Link className="collapse-item" to="/users">
                    Usuarios
                  </Link>
                </Show>
              </div>
            </div>
          </li>
        </Show>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider d-none d-md-block" />

        {/* <!-- Sidebar Toggler (Sidebar) --> */}
        <div className="text-center d-none d-md-inline">
          <button onClick={() => { clickMenuOpen() }} className="rounded-circle border-0" id="sidebarToggle"></button>
        </div>

      </ul>)
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ clickMenuOpen }, dispatch);

const mapStateToProps = store => ({
  toggled: store.menuState.menuOpen
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);