import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Connexion/UserProvider";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBTypography,
  MDBBtn,
  MDBInput,
  MDBIcon,
  MDBSpinner,
} from "mdb-react-ui-kit";
import axios from "axios";

const Profile = ({ isSidebarOpen }) => {
  const { user, setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    code_entreprise: user?.code_entreprise || "",
    code_user: user?.code_user || "",
    identite: user?.identite || "",
    position: user?.position || "",
    tel: user?.tel || "",
    email: user?.email || "",
    role: user?.role || "",
    profile_image: user?.profile_image || "",
  });

  const [imagePreview, setImagePreview] = useState(user?.profile_image || "");
  const [alertMessage, setAlertMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        code_entreprise: user.code_entreprise || "",
        code_user: user.code_user || "",
        identite: user.identite || "",
        position: user.position || "",
        tel: user.tel || "",
        email: user.email || "",
        role: user.role || "",
        profile_image: user.profile_image || "",
      });
      setImagePreview(user.profile_image || "");
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      axios
          .get(`/api/users/${user.id}`)
          .then((response) => {
            setFormData({
              code_entreprise: response.data.code_entreprise || "",
              code_user: response.data.code_user || "",
              identite: response.data.identite || "",
              position: response.data.position || "",
              tel: response.data.tel || "",
              email: response.data.email || "",
              role: response.data.role || "",
              profile_image: response.data.profile_image || "",
            });
            setImagePreview(response.data.profile_image || "");
          })
          .catch((err) => {
            console.error("Error fetching user data:", err);
            setAlertMessage({ type: "error", text: "Error loading user data" });
          });
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsImageLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setFormData({ ...formData, profile_image: base64Image });
        setImagePreview(base64Image);
        setIsImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlertMessage(null);

    axios
        .put(`/api/users/${user?.id}`, formData)
        .then((res) => {
          if (res.data && res.data.code_user) {
            setUser(res.data);
            setAlertMessage({ type: "success", text: "Profile updated successfully!" });
          }
        })
        .catch((err) => {
          console.error("Error updating profile:", err);
          setAlertMessage({ type: "error", text: "Error updating profile. Please try again." });
        })
        .finally(() => {
          setIsLoading(false);
        });
  };

  if (!user) {
    return (
        <div className="main-panel">
          <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
            <div className="d-flex justify-content-center align-items-center vh-100">
              <MDBSpinner role="status" color="primary" size="lg">
                <span className="visually-hidden">Loading...</span>
              </MDBSpinner>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="main-panel">
        <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
          <MDBContainer className="py-5">
            <MDBRow className="justify-content-center">
              <MDBCol lg="10">
                <MDBCard className="shadow-3" style={{ borderRadius: "15px", overflow: "hidden" }}>
                  <MDBRow className="g-0">
                    <MDBCol
                        md="4"
                        className="text-center text-white position-relative"
                        style={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          minHeight: "400px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                    >
                      <div className="position-relative mb-3">
                        <MDBCardImage
                            src={imagePreview || "https://via.placeholder.com/150?text=No+Image"}
                            alt="Profile Avatar"
                            className="rounded-circle shadow"
                            style={{
                              width: "120px",
                              height: "120px",
                              objectFit: "cover",
                              border: "4px solid rgba(255,255,255,0.3)"
                            }}
                        />
                        {isImageLoading && (
                            <div className="position-absolute top-50 start-50 translate-middle">
                              <MDBSpinner size="sm" color="light" />
                            </div>
                        )}
                        <div
                            className="position-absolute bottom-0 end-0 bg-white rounded-circle d-flex align-items-center justify-content-center shadow"
                            style={{
                              width: "35px",
                              height: "35px",
                              cursor: "pointer",
                              border: "2px solid #667eea"
                            }}
                            onClick={() => document.getElementById("imageUpload").click()}
                        >
                          <MDBIcon icon="camera" color="primary" />
                        </div>
                      </div>
                      <input
                          type="file"
                          id="imageUpload"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                      />
                      <MDBTypography tag="h4" className="mb-1 text-white">
                        {formData.identite || "User Name"}
                      </MDBTypography>
                      <MDBTypography tag="p" className="mb-0 text-white-50">
                        {formData.position || "Position"}
                      </MDBTypography>
                    </MDBCol>
                    <MDBCol md="8">
                      <MDBCardBody className="p-4">
                        <div className="d-flex align-items-center mb-4">
                          <MDBIcon icon="user-edit" className="me-3 text-primary" size="lg" />
                          <MDBTypography tag="h3" className="mb-0">
                            Edit Profile
                          </MDBTypography>
                        </div>

                        {alertMessage && (
                            <div
                                className={`alert alert-${alertMessage.type === "success" ? "success" : "danger"} alert-dismissible fade show mb-4`}
                                role="alert"
                            >
                              <MDBIcon
                                  icon={alertMessage.type === "success" ? "check-circle" : "exclamation-triangle"}
                                  className="me-2"
                              />
                              {alertMessage.text}
                              <button
                                  type="button"
                                  className="btn-close"
                                  onClick={() => setAlertMessage(null)}
                                  aria-label="Close"
                              ></button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                          <MDBRow className="mb-3">
                            <MDBCol md="6">
                              <MDBInput
                                  label="Code Utilisateur"
                                  id="code_user"
                                  name="code_user"
                                  value={formData.code_user}
                                  onChange={handleChange}
                                  icon="id-card"
                                  type="text"
                                  required
                              />
                            </MDBCol>
                            <MDBCol md="6">
                              <MDBInput
                                  label="Code Entreprise"
                                  id="code_entreprise"
                                  name="code_entreprise"
                                  value={formData.code_entreprise}
                                  onChange={handleChange}
                                  icon="building"
                                  type="text"
                                  required
                              />
                            </MDBCol>
                          </MDBRow>

                          <MDBRow className="mb-3">
                            <MDBCol md="6">
                              <MDBInput
                                  label="Email"
                                  id="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  icon="envelope"
                                  type="email"
                                  required
                              />
                            </MDBCol>
                            <MDBCol md="6">
                              <MDBInput
                                  label="Téléphone"
                                  id="tel"
                                  name="tel"
                                  value={formData.tel}
                                  onChange={handleChange}
                                  icon="phone"
                                  type="tel"
                              />
                            </MDBCol>
                          </MDBRow>

                          <MDBRow className="mb-3">
                            <MDBCol md="6">
                              <MDBInput
                                  label="Position"
                                  id="position"
                                  name="position"
                                  value={formData.position}
                                  onChange={handleChange}
                                  icon="briefcase"
                                  type="text"
                              />
                            </MDBCol>
                            <MDBCol md="6">
                              <MDBInput
                                  label="Rôle"
                                  id="role"
                                  name="role"
                                  value={formData.role}
                                  onChange={handleChange}
                                  icon="user-tag"
                                  type="text"
                                  disabled
                              />
                            </MDBCol>
                          </MDBRow>

                          <div className="d-flex justify-content-end mt-4">
                            <MDBBtn
                                type="submit"
                                color="primary"
                                size="lg"
                                disabled={isLoading}
                                style={{
                                  minWidth: "160px",
                                  borderRadius: "25px",
                                  fontWeight: "600",
                                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                                }}
                            >
                              {isLoading ? (
                                  <>
                                    <MDBSpinner size="sm" className="me-2" />
                                    Saving...
                                  </>
                              ) : (
                                  <>
                                    <MDBIcon icon="save" className="me-2" />
                                    Save Changes
                                  </>
                              )}
                            </MDBBtn>
                          </div>
                        </form>
                      </MDBCardBody>
                    </MDBCol>
                  </MDBRow>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
      </div>
  );
};

export default Profile;
