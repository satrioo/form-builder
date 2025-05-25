export const jobApplicationSchema = {
  title: "Job Application Form",
  description: "Please fill in your details and upload your resume.",
  fields: [
    {
      type: "text",
      label: "Full Name",
      model: "fullName",
      required: true,
      placeholder: "John Doe",
      validation: {
        minLength: 3,
      },
    },
    {
      type: "email",
      label: "Email Address",
      model: "email",
      required: true,
      placeholder: "john@example.com",
      validation: {
        email: true,
      },
    },
    {
      type: "tel",
      label: "Phone Number",
      model: "phone",
      required: true,
      placeholder: "+1 555-1234",
      validation: {
        number: true,
      },
    },
    {
      type: "select",
      label: "Position Applying For",
      model: "position",
      required: true,
      options: [
        { label: "Frontend Developer", value: "frontend" },
        { label: "Backend Developer", value: "backend" },
        { label: "Full Stack Developer", value: "fullstack" },
      ],
    },
    {
      type: "textarea",
      label: "Cover Letter",
      model: "coverLetter",
      required: false,
      placeholder: "Write something about yourself...",
    },
    {
      type: "file",
      label: "Upload Resume",
      model: "resume",
      required: true,
      accept: ".pdf,.doc,.docx",
    },
    {
      type: "checkbox",
      label: "Are you currently employed?",
      model: "employed",
    },
    {
      type: "text",
      label: "Current Employer",
      model: "employer",
      required: true,
      visibleIf: {
        employed: true,
      },
    },
    {
      type: "group",
      label: "Address Details",
      model: "address",
      fields: [
        {
          type: "text",
          label: "Street",
          model: "street",
          placeholder: "Street",
          required: true,
        },
        {
          type: "text",
          label: "City",
          model: "city",
          placeholder: "City",
          required: true,
        },
        {
          type: "text",
          label: "Postal Code",
          model: "postalCode",
          placeholder: "Postal Code",
          required: true,
          validation: {
            number: true,
          },
        },
      ],
    },
    {
      type: "checkbox",
      label: "I agree to the terms and conditions",
      model: "agree",
      required: true,
    },
  ],
} as const;
