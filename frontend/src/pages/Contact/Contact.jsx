import './Contact.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/button';

const Contact = () => {
  const onSubmitClick = async e => {
    e.preventDefault();

    // Fetch input values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !mobile || !message) {
      alert('Please fill all fields');
      return;
    }

    const formData = { name, email, mobile, message };

    try {
      // Send to our backend email service
      const response = await fetch(
        'http://localhost:5000/api/email/contact',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert('Form submitted successfully! We will get back to you soon.');
        document.getElementById('contactForm').reset(); // Clear form after submission
      } else {
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="contact">
        <div className="con-sec1">
          <h1>Contact Us</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
            cumque placeat nulla sed quibusdam deleniti nesciunt provident
            ducimus! Corporis cum cupiditate quisquam dignissimos suscipit
            repellat consectetur ipsam doloribus non ad.
          </p>
        </div>
        <div className="con-sec2">
          <div className="left">
            <h3>Contact Us</h3>
            <h1 className="heading">Get In Touch</h1>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum
              fuga inventore eius voluptates soluta sit accusantium quidem
              repellat cumque minima, quisquam neque reprehenderit enim
              consectetur nostrum. Illo placeat dicta ea.
            </p>

            <div className="cont-iconsMain">
              <div className="cont-icons2">
                <i class="material-icons">call</i>
                <h3>Call Us</h3>
                <p>91+ 9446979075</p>
              </div>
              <div className="cont-icons2">
                <i class="material-icons">maile</i>
                <h3>Email Us</h3>
                <p>nittothomas94@gmail.com</p>
              </div>
              <div className="cont-icons2">
                <i class="material-icons">pin_drop</i>
                <h3>Loaction</h3>
                <p>Champakulam</p>
              </div>
              <div className="cont-icons2">
                <i class="material-icons">language</i>
                <h3>Website</h3>
                <p>turfTime.com</p>
              </div>
            </div>

            <h1>Follow Us On</h1>
            <div className="cont-iconsMain02">
              <i class="fa-brands fa-instagram"></i>
              <i class="fa-brands fa-square-facebook"></i>
              <i class="fa-brands fa-linkedin"></i>
              <i class="fa-brands fa-square-x-twitter"></i>
            </div>
          </div>

          <div className="right">
            <div className="contact-box">
              <form id="contactForm">
                <Input
                  type="text"
                  label="Name"
                  classname="input w-full"
                  id="name"
                />
                <Input
                  type="email"
                  label="Email"
                  classname="input"
                  id="email"
                />
                <Input
                  type="number"
                  label="Mobile Number"
                  classname="input"
                  id="mobile"
                />
                <Input
                  type="text"
                  label="Message"
                  classname="con-box-messageInput"
                  id="message"
                />
                <Button
                  text="Submit"
                  className="send-button"
                  onclick={onSubmitClick}
                />
              </form>
            </div>
            <img
              src="/images/marketing.jpg"
              alt="marketing image"
              id="marketing"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
