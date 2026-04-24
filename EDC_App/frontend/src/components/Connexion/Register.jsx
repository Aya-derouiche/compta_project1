import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const [entrepriseCodes, setEntrepriseCodes] = useState([]);
  const [comptableCodes, setComptableCodes] = useState([]);
  const [userData, setUserData] = useState({
    code_entreprise: "",
    code_comptable: "",
    code_user: "",
    identite: "",
    position: "",
    tel: "",
    email: "",
    mot_de_passe: "",
    role: "utilisateur",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (key, value, role) => {
    let error = "";

    switch(key) {
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email invalide";
        }
        break;
      case 'mot_de_passe':
        if (value.length < 6) {
          error = "Le mot de passe doit contenir au moins 6 caractères";
        }
        break;
      case 'tel':
        if (!/^[0-9]{8,15}$/.test(value)) {
          error = "Téléphone invalide (8-15 chiffres)";
        }
        break;
      case 'identite':
        if (!value.trim()) {
          error = "L'identité est requise";
        }
        break;
      case 'position':
        if (!value.trim()) {
          error = "La position est requise";
        }
        break;
      case 'code_user':
        if (role === 'utilisateur' && !value.trim()) {
          error = "Le code utilisateur est requis";
        }
        break;
      case 'code_entreprise':
        if (!value.trim()) {
          error = "Le code entreprise est requis";
        }
        break;
      case 'code_comptable':
        if (role === 'comptable' && !value.trim()) {
          error = "Le code comptable est requis";
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [key]: error }));
    return !error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: "" }));
    
    // Validate the field
    validateField(name, value, userData.role);
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setUserData({
      code_entreprise: "",
      code_comptable: "",
      code_user: "",
      identite: "",
      position: "",
      tel: "",
      email: "",
      mot_de_passe: "",
      role: value,
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    const fieldsToValidate = ['identite', 'position', 'tel', 'email', 'mot_de_passe', 'code_entreprise'];
    
    if (userData.role === 'utilisateur') {
      fieldsToValidate.push('code_user');
    } else if (userData.role === 'comptable') {
      fieldsToValidate.push('code_comptable');
    }

    for (const field of fieldsToValidate) {
      const fieldIsValid = validateField(field, userData[field], userData.role);
      if (!fieldIsValid) isValid = false;
    }

    if (!isValid) {
      alert("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    // Prepare data for submission
  const submitData = {
  code_entreprise: userData.code_entreprise,
  identite: userData.identite,
  position: userData.position,
  tel: userData.tel,
  email: userData.email,
  mot_de_passe: userData.mot_de_passe,
  role: userData.role,
};

// 👇 حسب الدور
if (userData.role === "utilisateur") {
  submitData.code_user = userData.code_user;
}

if (userData.role === "comptable") {
  submitData.code_comptable = userData.code_comptable;
}

    console.log('Données envoyées :', submitData);

    try {
      const response = await axios.post("http://localhost:5000/api/register", submitData);
      console.log("Réponse du serveur:", response.data);
      alert("Utilisateur ajouté avec succès !");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error.response?.data || error);
      alert(error.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  useEffect(() => {
    const fetchEntrepriseCodes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/code_entreprises");
        setEntrepriseCodes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEntrepriseCodes();
  }, []);

  useEffect(() => {
    const fetchComptableCodes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/comptables");
        setComptableCodes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchComptableCodes();
  }, []);

  return (
    <div className="container-fluid page-body-wrapper full-page-wrapper">
      <div className="content-wrapper d-flex align-items-center auth px-0 pt-4">
        <div className="row w-100 mx-0">
          <div className="col-lg-6 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <div className="brand-logo mb-3">
                <img src="assets/images/logo-compta.png" alt="logo" />
              </div>
              <h4>New here?</h4>
              <h6 className="font-weight-light">Signing up is easy. It only takes a few steps</h6>
              <form className="pt-3" onSubmit={handleSubmit}>
                {/* Role Selection Dropdown */}
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    className="form-control"
                    name="role"
                    value={userData.role}
                    onChange={handleRoleChange}
                    style={{color: "black"}}
                  >
                    <option value="utilisateur">Utilisateur</option>
                    <option value="comptable">Comptable</option>
                  </select>
                </div>

                {/* Common Fields for both roles */}
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={`form-control rounded ${errors.identite ? "is-invalid" : ""}`}
                        name="identite"
                        value={userData.identite}
                        onChange={handleChange}
                        placeholder="Identité"
                        required
                      />
                      {errors.identite && <div className="invalid-feedback">{errors.identite}</div>}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={`form-control rounded ${errors.position ? "is-invalid" : ""}`}
                        name="position"
                        value={userData.position}
                        onChange={handleChange}
                        placeholder="Position"
                        required
                      />
                      {errors.position && <div className="invalid-feedback">{errors.position}</div>}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="tel"
                        className={`form-control rounded ${errors.tel ? "is-invalid" : ""}`}
                        name="tel"
                        value={userData.tel}
                        onChange={handleChange}
                        placeholder="Téléphone"
                        required
                      />
                      {errors.tel && <div className="invalid-feedback">{errors.tel}</div>}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="email"
                        className={`form-control rounded ${errors.email ? "is-invalid" : ""}`}
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="password"
                        className={`form-control rounded ${errors.mot_de_passe ? "is-invalid" : ""}`}
                        name="mot_de_passe"
                        value={userData.mot_de_passe}
                        onChange={handleChange}
                        placeholder="Mot de Passe (min 6 caractères)"
                        required
                      />
                      {errors.mot_de_passe && <div className="invalid-feedback">{errors.mot_de_passe}</div>}
                    </div>
                    <div className="col-md-6">
                      <select
                        style={{ color: "black" }}
                        className={`form-control rounded ${errors.code_entreprise ? "is-invalid" : ""}`}
                        name="code_entreprise"
                        value={userData.code_entreprise}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Sélectionner Code Entreprise</option>
                        {entrepriseCodes.map((code, index) => (
                          <option key={`${code.code_entreprise}-${index}`} value={code.code_entreprise}>
                            {code.code_entreprise}
                          </option>
                        ))}
                      </select>
                      {errors.code_entreprise && <div className="invalid-feedback">{errors.code_entreprise}</div>}
                    </div>
                  </div>
                </div>

                {/* Role-Specific Fields */}
                {userData.role === "utilisateur" && (
                  <div className="form-group">
                    <div className="row">
                      <div className="col-md-12">
                        <input
                          type="text"
                          className={`form-control rounded ${errors.code_user ? "is-invalid" : ""}`}
                          name="code_user"
                          value={userData.code_user}
                          onChange={handleChange}
                          placeholder="Code Utilisateur"
                          required
                        />
                        {errors.code_user && <div className="invalid-feedback">{errors.code_user}</div>}
                      </div>
                    </div>
                  </div>
                )}

                {userData.role === "comptable" && (
                  <div className="form-group">
                    <div className="row">
                      <div className="col-md-12">
                        <select
                          className={`form-control rounded ${errors.code_comptable ? "is-invalid" : ""}`}
                          style={{ color: "black" }}
                          name="code_comptable"
                          value={userData.code_comptable}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Sélectionner Comptable</option>
                          {comptableCodes.map((comptable, index) => (
                            <option key={`${comptable.code_user}-${index}`} value={comptable.code_user}>
                              {`${comptable.identite} - ${comptable.code_user}`}
                            </option>
                          ))}
                        </select>
                        {errors.code_comptable && <div className="invalid-feedback">{errors.code_comptable}</div>}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-3">
                  <button type="submit" className="btn btn-primary btn-lg btn-block">
                    SIGN UP
                  </button>
                </div>
              </form>
              <div className="text-center mt-4 font-weight-light">
                Already have an account? <a href="/" className="text-primary">Login</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;