import { FaPhone, FaYoutube, FaTiktok } from "react-icons/fa";
const UserFooter = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        {/* BRAND */}
        <div>
          <h3 style={styles.logo}>Robotec</h3>
          <p style={styles.text}>
            Quality arduino products at affordable prices.
          </p>
        </div>

        {/* CONTACT */}
        <div>
          <h4>Contact</h4>
          <p style={styles.text}>
            <FaPhone /> +254 722563673
          </p>
          <p style={styles.text}>Email: jjmzerah@gmail.com</p>
        </div>

        {/* SOCIAL */}
        <div>
          <h4>Follow Us</h4>
          <div style={styles.socials}>
            
            <a href="https://youtube.com/@jimmy-compteacher?si=8lkdc9q4yO9oHGBx" style={styles.icon} target="_blank" rel="noreferrer">
               <FaYoutube />
            </a>
            <a href="https://vm.tiktok.com/ZS9FRvNSGq2u8-3BGs9/" style={styles.icon} target="_blank" rel="noreferrer">
            <FaTiktok />
            </a>
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div style={styles.bottom}>
        © {new Date().getFullYear()} Robotec. All rights reserved.                  version 1.0
      </div>
    </footer>
  );
};

export default UserFooter;


/* ================= STYLES ================= */

const styles = {
  footer: {
    background: "#2196f3",
    color: "#fff",
    marginTop: "40px",
    paddingTop: "30px",
  },

  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    padding: "20px 40px",
  },

  logo: {
    marginBottom: "10px",
  },

  text: {
    fontSize: "14px",
    color: "#fff",
  },

  socials: {
    display: "flex",
    gap: "15px",
    marginTop: "10px",
  },

  icon: {
    color: "#fff",
    fontSize: "18px",
  },

  bottom: {
    borderTop: "1px solid #333",
    textAlign: "center",
    padding: "10px",
    fontSize: "15px",
    color: "#333",
  },
};