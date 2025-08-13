import mongoose from 'mongoose';
import TextBlock from '../models/TextBlock';
import Image from '../models/Image';

// Update with your actual username and password
const MONGO_URI = 'mongodb+srv://myuser:Anshum@255@tpc.z8zgugo.mongodb.net/tpcDB?retryWrites=true&w=majority&appName=TPC';

const textBlocks = [
  { title: 'Site Title', value: 'Turning Point' },
  { title: 'Site Tagline', value: "Gujarat's Largest Student-Run Society" },
  { title: 'Homepage Heading', value: 'Welcome to Turning Point Community' },
  { title: 'Homepage Subheading', value: "Empowering over 10,000 students across Gujarat through intellectually enriching platforms that foster leadership, critical thinking, and civic engagement." },
  { title: 'About Section Title', value: "Shaping Tomorrow's Leaders" },
  { title: 'About Section Badge', value: 'About TPC' },
  { title: 'Explore Section Title', value: 'Explore TPC' },
  { title: 'Explore Section Subheading', value: 'Discover different aspects of our vibrant Community' },
  { title: 'Quick Link 1', value: 'Our Events' },
  { title: 'Quick Link 2', value: 'Meet Our Team' },
  { title: 'Quick Link 3', value: 'Join TPC' },
  { title: 'Quick Link 4', value: 'Gallery' },
  { title: 'Quick Link 4 Desc', value: 'Moments from our events' },
  { title: 'Events Section Title', value: 'Events we have done' },
  { title: 'Events Section Subheading', value: "Be part of Gujarat's most prestigious academic competitions" },
  { title: 'Leaders Section Title', value: 'Meet Our Leaders' },
  { title: 'Leaders Section Subheading', value: "The passionate individuals driving TPC's mission forward" },
  { title: 'Connect Section Title', value: 'Connect With Us' },
  { title: 'Connect Section Subheading', value: "Stay updated with our latest events, achievements, and Community highlights across all social platforms" },
  { title: 'What We Do Title', value: 'What We Do' },
  { title: 'What We Do 1', value: 'Debate Competitions' },
  { title: 'What We Do 2', value: 'MUNited Nations' },
  { title: 'What We Do 3', value: 'Leadership Workshops' },
  { title: 'What We Do 4', value: 'Social Impact Initiatives' },
  { title: 'Contact Section Title', value: 'Contact Us' },
  { title: 'Contact Section Subheading', value: "Ready to join Gujarat's most dynamic student Community? We're here to help and answer any questions you might have." },
  { title: 'Contact Form Title', value: 'Send us a Message' },
  { title: 'Contact Form Subheading', value: "Have questions about our events, want to join our team, or need more information? Fill out the form below and we'll get back to you soon." },
  { title: 'Contact Form Name', value: 'Full Name' },
  { title: 'Contact Form Email', value: 'Email Address' },
  { title: 'Contact Form Phone', value: 'Phone Number' },
  { title: 'Contact Form Subject', value: 'Subject' },
  { title: 'Contact Form Message', value: 'Message' },
  { title: 'Contact Form Button', value: 'Send Message' },
  { title: 'Team Section Title', value: 'Our Team' },
  { title: 'Team Section Subheading', value: "Meet the passionate individuals and distinguished advisors who drive TPC's mission to empower Gujarat's youth" },
  { title: 'Core Team Title', value: 'Core Team' },
  { title: 'Core Team Subheading', value: "The dedicated leaders who make TPC's vision a reality" },
  { title: 'Advisors Section Title', value: 'Board of Advisors' },
  { title: 'Advisors Section Subheading', value: 'Distinguished professionals and thought leaders who guide our mission and provide invaluable expertise' },
  { title: 'Interactions Section Title', value: 'Interactions' },
  { title: 'Interactions Section Subheading', value: 'Explore our collaborative partnerships and Community engagements' },
  { title: 'Connect With Team Title', value: 'Connect With Our Team' },
  { title: 'Connect With Team Subheading', value: "Ready to join our mission? Reach out to our team members directly or send us a message." },
  { title: 'Join Team Button', value: 'Join Our Team' },
  { title: 'Contact Team Button', value: 'Contact Us' },
  { title: 'Signup Heading', value: 'Start Your Journey to Leadership Excellence' },
  { title: 'Signup Subheading', value: "Join over 10,000 students across Gujarat in our mission to foster leadership, critical thinking, and civic engagement through intellectually enriching experiences." },
  { title: 'Signup Benefits Title', value: "What you'll get:" },
  { title: 'Signup Benefit 1', value: 'Access to exclusive events and competitions' },
  { title: 'Signup Benefit 2', value: 'Networking with like-minded individuals' },
  { title: 'Signup Benefit 3', value: 'Leadership development opportunities' },
  { title: 'Signup Benefit 4', value: 'Mentorship from industry experts' },
  { title: 'Login Heading', value: 'Welcome Back to Your Leadership Journey' },
  { title: 'Login Subheading', value: 'Continue your path to excellence with access to exclusive events, networking opportunities, and leadership development programs.' },
  { title: 'Login Welcome', value: 'Welcome Back' },
  { title: 'Login Button', value: 'Sign in to your account to continue' },
  { title: 'Signup Button', value: 'Create your account and start your leadership journey' },
];

const images = [
  { title: 'Site Logo', url: '/images/logo.png', alt: 'Turning Point Community Logo' },
  { title: 'Hero Image', url: '/images/hero.jpg', alt: 'Turning Point Community Hero' },
  { title: 'Gallery Image', url: '/images/gallery.jpg', alt: 'Turning Point Community Gallery' },
  { title: 'Team Image', url: '/images/team.jpg', alt: 'Turning Point Community Team' },
  // Add more images as needed...
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Upsert text blocks
  for (const block of textBlocks) {
    await TextBlock.findOneAndUpdate(
      { title: block.title },
      { value: block.value },
      { upsert: true, new: true }
    );
    console.log(`Upserted text block: ${block.title}`);
  }

  for (const img of images) {
    await Image.findOneAndUpdate(
      { title: img.title },
      { url: img.url, alt: img.alt },
      { upsert: true, new: true }
    );
    console.log(`Upserted image: ${img.title}`);
  }

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
}); 