
export const logos = [
  "../../../assets/images-removebg-preview.png",
  "../../../assets/chanel.png",
  "../../../assets/lenovo-company-logo-image-png-701751694771312slrvtpwjhi-removebg-preview.png",
  "../../../assets/sony_logo_PNG3-removebg-preview.png",
  "../../../assets/pngimg.com_-_nike_PNG11-removebg-preview.png",
  "../../../assets/rolex-removebg-preview.png",
  "../../../assets/images-removebg-preview.png",
  "../../../assets/chanel.png",
  "../../../assets/lenovo-company-logo-image-png-701751694771312slrvtpwjhi-removebg-preview.png",
  "../../../assets/sony_logo_PNG3-removebg-preview.png",
  "../../../assets/pngimg.com_-_nike_PNG11-removebg-preview.png",
  "../../../assets/rolex-removebg-preview.png"
];
export const mockData = {
  doctorsCount: 12,
  appointmentsCount: 45,
  patientsCount: 128,
  latestBookings: [
    { id: 1, patient: "John Doe", doctor: "Dr. Smith", date: "2025-03-28", time: "10:00 AM" },
    { id: 2, patient: "Jane Roe", doctor: "Dr. Adams", date: "2025-03-28", time: "11:30 AM" },
    { id: 3, patient: "Bob Wilson", doctor: "Dr. Lee", date: "2025-03-27", time: "02:15 PM" },
    { id: 4, patient: "Alice Brown", doctor: "Dr. Smith", date: "2025-03-27", time: "09:45 AM" },
  ],
};
export const appointmentsMockData = [
  { id: 1, patient: "John Doe", doctor: "Dr. Smith", date: "2025-03-28", time: "10:00 AM", status: "Confirmed" },
  { id: 2, patient: "Jane Roe", doctor: "Dr. Adams", date: "2025-03-28", time: "11:30 AM", status: "Pending" },
  { id: 3, patient: "Bob Wilson", doctor: "Dr. Lee", date: "2025-03-27", time: "02:15 PM", status: "Completed" },
  { id: 4, patient: "Alice Brown", doctor: "Dr. Smith", date: "2025-03-27", time: "09:45 AM", status: "Confirmed" },
  { id: 5, patient: "Emma Davis", doctor: "Dr. Jones", date: "2025-03-29", time: "03:00 PM", status: "Pending" },
  { id: 6, patient: "Mike Taylor", doctor: "Dr. Adams", date: "2025-03-30", time: "01:00 PM", status: "Cancelled" },
];
export const specialtyOptions = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "General Practice",
];

export const testimonials = [
  {
    name: 'Lisa Albert',
    role: 'CEO at Google',
    feedback: 'An amazing service',
    desc: 'Lorem ipsum dolor sit amet consectetur adipiscing elit luctus a nunc mauris scelerisque sed egestas.',
    img: '../../../assets/TeamMembers/Lisa Albert.png',
  },
  {
    name: 'Sophie Moore',
    role: 'MD at Facebook',
    feedback: 'One of a kind service',
    desc: 'Ultrices est in cursus turpis massa tincidunt nulla mollis pharetra diam sit amet nisl suscipit.',
    img: '../../../assets/TeamMembers/Sophie Moore.png',
  },
  {
    name: 'Andy Smith',
    role: 'CEO Dot Austere',
    feedback: 'The best service',
    desc: 'Convallis posuere morbi leo urna molestie at elementum eu facilisis sapien pellentesque lesa a sunta.',
    img: '../../../assets/TeamMembers/Andy Smith.png',
  },
];
export const faqs = [
  { question: 'What is quantum mechanics?', answer: 'Quantum mechanics is a fundamental theory in physics that explains the behavior of matter and energy on atomic and subatomic levels.' },
  { question: 'How does gravity work?', answer: 'Gravity is the force that attracts two bodies towards each other. It is what keeps planets in orbit around stars and causes objects to fall to the ground.' },
  { question: 'What is relativity?', answer: 'Relativity is a theory by Einstein that describes the laws of physics in the presence of gravitational fields and how they relate to space and time.' },
  { question: 'Why is the sky blue?', answer: 'The sky appears blue due to Rayleigh scattering of sunlight by the atmosphere. Shorter blue wavelengths scatter more than other colors.' },
  { question: 'What is a black hole?', answer: 'A black hole is a region in space with a gravitational pull so strong that nothing, not even light, can escape.' },
  { question: 'How do airplanes fly?', answer: 'Airplanes fly because of the lift created by their wings as air flows over and under them, generating upward force.' },
  { question: 'What causes seasons?', answer: 'Seasons are caused by the tilt of the Earth\'s axis as it orbits the Sun, resulting in varying sunlight intensity.' },
  { question: 'What is photosynthesis?', answer: 'Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water.' },
  { question: 'How does the internet work?', answer: 'The internet works by connecting devices using a global network of cables, routers, and data centers to transmit information.' },
];
export  const stats = [
  { number: 99, unit: "%", label: "Customer satisfaction" },
  { number: 15, unit: "k", label: "Online Patients" },
  { number: 12, unit: "k", label: "Patients Recovered" },
  { number: 240, unit: "%", label: "Company growth" },
];
 export const doctorsData = {
    "Cardiologist": [
      { id: 1, name: "Dr. John Doe", specialty: "Cardiologist", experience: 12, hospital: "City Heart" },
      { id: 2, name: "Dr. Sarah Smith", specialty: "Cardiologist", experience: 10, hospital: "Pulse Care" },
    ],
    "Orthodontist": [
      { id: 3, name: "Dr. Emily Brown", specialty: "Dentist", experience: 8, hospital: "Smile Clinic" },
      { id: 4, name: "Dr. Michael Green", specialty: "Dentist", experience: 7, hospital: "Dental Care" }
    ],
    "Neurologist": [
      { id: 5, name: "Dr. Linda White", specialty: "Neurologist", experience: 15, hospital: "NeuroLife" },
      { id: 6, name: "Dr. James Black", specialty: "Neurologist", experience: 13, hospital: "Brain & Spine" }
    ],
    "Orthopedic": [
      { id: 7, name: "Dr. Robert Wilson", specialty: "Orthopedic", experience: 11, hospital: "Bone & Joint Hospital" },
      { id: 8, name: "Dr. Anna Taylor", specialty: "Orthopedic", experience: 9, hospital: "OrthoWell Clinic" }
    ],
    "Pediatrician": [
      { id: 9, name: "Dr. Mark Allen", specialty: "Pediatrician", experience: 14, hospital: "Children’s" },
      { id: 10, name: "Dr. Olivia Martinez", specialty: "Pediatrician", experience: 10, hospital: "Little Angels" }
    ]
  };
  export const doctors = [
    {
      id: 1,
      name: "Dr. Richard James",
      specialty: "MBBS - General Physician",
      experience: 4,
      fee: 50,
      image: "path/to/image.jpg", // Optional, if you want to include an image
    },
    // Add more doctors as needed
  ];
  export const services = [
    {
      title: 'Dental treatments',
      image: '../../assets/Services/Dentist.png',
      description: 'Lorem ipsum dolor sit amet consectetur tur adipiscing elit semper dalaracc lacus vel facilisis volutpat est velitom.',
      link:"https://www.betterhealth.vic.gov.au/health/conditionsandtreatments/dental-treatment"
    },
    {
      title: 'Bones treatments',
      image:'../../assets/Services/Bones treatment.png',
      description: 'Lorem ipsum dolor sit amet consectetur tur adipiscing elit semper dalaracc lacus vel facilisis volutpat est velitom.',
      link:"https://www.betterhealth.vic.gov.au/health/conditionsandtreatments/bone-fractures"
    },
    {
      title: 'Diagnosis',
      image: '../../assets/Services/Diagnosis.png',
      description: 'Lorem ipsum dolor sit amet consectetur tur adipiscing elit semper dalaracc lacus vel facilisis volutpat est velitom.',
      link:"https://www.ncbi.nlm.nih.gov/books/NBK338593/"
    },
    {
      title: 'Cardiology',
      image: '../../assets/Services/Cardiology.pnjg.png',
      description: 'Lorem ipsum dolor sit amet consectetur tur adipiscing elit semper dalaracc lacus vel facilisis volutpat est velitom.',
      link:"https://my.clevelandclinic.org/health/diagnostics/16832-cardiac-catheterization"
    },
    {
      title: 'Surgery',
      image: '../../assets/Services/Surgery.png',
      description: 'Lorem ipsum dolor sit amet consectetur tur adipiscing elit semper dalaracc lacus vel facilisis volutpat est velitom.',
      link:"https://www.britannica.com/science/surgery-medicine",
    },
    {
      title: 'Eye care',
      image: '../../assets/Services/EyeCare.png',
      description: 'Lorem ipsum dolor sit amet consectetur tur adipiscing elit semper dalaracc lacus vel facilisis volutpat est velitom.',
      link:"https://www.slideshare.net/slideshow/eye-care-243533885/243533885"
    },
  ];
  export  const members = [
    { name: 'List Albert', role: 'CEO & CO-FOUNDER', img: '../../../assets/TeamMembers/Lisa Albert.png',
      desc: 'Lorem ipsum dolor sit amet consectetur adipiscing elit amet hendrerit pretium.',
      socials: ['facebook', 'twitter', 'linkedin'] },
    { name: 'Sophie Moore', role: 'DENTAL SPECIALIST', img: '../../../assets/TeamMembers/Sophie Moore.png',
      desc: 'Lorem ipsum dolor sit amet consectetur adipiscing elit amet hendrerit pretium.',
      socials: ['facebook', 'twitter', 'instagram', 'linkedin'] },
    { name: 'Matt Cannon', role: 'ORTHOPEDIC', img: '../../../assets/TeamMembers/Matt Cannon.png',
      desc: 'Lorem ipsum dolor sit amet consectetur adipiscing elit amet hendrerit pretium.',
      socials: ['facebook', 'twitter', 'linkedin'] },
    { name: 'Andy Smith', role: 'BRAIN SURGEON', img: '../../../assets/TeamMembers/Andy Smith.png',
      desc: 'Lorem ipsum dolor sit amet consectetur adipiscing elit amet hendrerit pretium.',
      socials: ['facebook', 'twitter', 'linkedin'] },
    { name: 'Lily Woods', role: 'HEART SPECIALIST', img: '../../../assets/TeamMembers/Lily Woods.png',
      desc: 'Lorem ipsum dolor sit amet consectetur adipiscing elit amet hendrerit pretium.',
      socials: ['facebook', 'twitter', 'instagram', 'linkedin'] },
    { name: 'Patrick Meyer', role: 'EYE SPECIALIST', img: '../../../assets/TeamMembers/Patric Meyer.png',
      desc: 'Lorem ipsum dolor sit amet consectetur adipiscing elit amet hendrerit pretium.',
      socials: ['facebook', 'twitter','instagram', 'linkedin'] },
  ];
export const timeSlots = ["01:30 PM", "02:30 PM", "03:00 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"];
