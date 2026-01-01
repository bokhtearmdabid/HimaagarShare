import './about.css';

export default function About() {
  return (
    <div className="container">
      {/* Header Section */}
      <div className="header">
        <h1 className="title">About Us</h1>
        <p className="subtitle">Learn more about our story and mission</p>
      </div>

      {/* Cards Section */}
      <div className="content">
        <div className="card">
          <h2 className="cardTitle">Our Mission</h2>
          <p className="cardText">
            We strive to deliver innovative solutions that empower businesses 
            and individuals to achieve their goals through cutting-edge technology 
            and exceptional service.
          </p>
        </div>

        <div className="card">
          <h2 className="cardTitle">Our Vision</h2>
          <p className="cardText">
            To become a leading force in digital transformation, creating meaningful 
            impact in the lives of our customers and communities worldwide.
          </p>
        </div>

        <div className="card">
          <h2 className="cardTitle">Our Values</h2>
          <p className="cardText">
            Innovation, integrity, and customer focus drive everything we do. 
            We believe in building lasting relationships based on trust and 
            delivering excellence in every interaction.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="story">
        <h2 className="storyTitle">Our Story</h2>
        <p className="storyText">
          Founded in 2020, our company started with a simple idea: to make 
          technology accessible and beneficial for everyone. What began as a 
          small team of passionate developers has grown into a thriving 
          organization serving clients globally.
        </p>
        <p className="storyText">
          Today, we continue to push boundaries and explore new possibilities, 
          always keeping our customers at the heart of everything we do. 
          Our journey is just beginning, and we're excited about what the 
          future holds.
        </p>
      </div>

      {/* Team Section */}
      <div className="team">
        <h2 className="teamTitle">Meet Our Team</h2>
        <div className="teamGrid">
          <div className="teamMember">
            <div className="memberImage">👨</div>
            <h3 className="memberName">John Doe</h3>
            <p className="memberRole">CEO & Founder</p>
          </div>

          <div className="teamMember">
            <div className="memberImage">👩</div>
            <h3 className="memberName">Jane Smith</h3>
            <p className="memberRole">CTO</p>
          </div>

          <div className="teamMember">
            <div className="memberImage">👨</div>
            <h3 className="memberName">Mike Johnson</h3>
            <p className="memberRole">Lead Developer</p>
          </div>

          <div className="teamMember">
            <div className="memberImage">👩</div>
            <h3 className="memberName">Sarah Williams</h3>
            <p className="memberRole">Design Director</p>
          </div>
        </div>
      </div>
    </div>
  );
}