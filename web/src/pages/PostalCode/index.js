import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const PostalCode = ({
  prbForm,
  prbReset,
  prb: { requestingFetchPrbs,
    successfulFetchPrbs,
    errorFetchPrbs,
    pbrs
  },
}) => {
  const history = useHistory();
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    prbForm(data);
  };


  useEffect(() => {
    console.log(pbrs);
  }, [pbrs]);

  return (
    <div className="container">
      {/* <!-- Outer Row --> */}
      <div className="row justify-content-center">

        <div className="col-xl-10 col-lg-12 col-md-9">

          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-body p-0">
              {/* <!-- Nested Row within Card Body --> */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-4">Consulta información de tu código postal</h1>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="user">
                      <div className="form-group">
                        <input type="text" className={`form-control form-control-user ${errors.code && 'is-invalid'
                          }`} {...register('code', { required: true })} placeholder="Código postal" />
                      </div>
                      <button type="submit" className="btn btn-primary btn-user btn-block">
                        Buscar
                      </button>
                    </form>
                  </div>
                  {
                    pbrs &&
                    Object.keys(pbrs).length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th scope="col">D_CODIGO</th>
                              <th scope="col">D_ASENTA</th>
                              <th scope="col">D_TIPO_ASENTA</th>
                              <th scope="col">D_MNPIO</th>
                              <th scope="col">D_ESTADO</th>
                              <th scope="col">D_CIUDAD</th>
                              <th scope="col">D_ZONA</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pbrs.map((ele, key) => (
                              <tr key={key}>
                                <td scope="row">{ele.d_codigo}</td>
                                <td scope="row">{ele.d_asenta}</td>
                                <td scope="row">{ele.d_tipo_asenta}</td>
                                <td scope="row">{ele.d_mnpio}</td>
                                <td scope="row">{ele.d_estado}</td>
                                <td scope="row">{ele.d_ciudad}</td>
                                <td scope="row">{ele.d_zona}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div >

  );
};

const mapStateToProps = (state) => {
  return {
    prb: state.prb,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    prbForm: (data) =>
      dispatch({
        type: 'FETCH_PRBS_REQUEST',
        data,
      }),
    prbReset: () =>
      dispatch({
        type: 'RESET_PRBS',
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostalCode);