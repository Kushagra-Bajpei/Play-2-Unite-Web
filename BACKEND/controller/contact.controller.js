import { Contact } from "../model/contact.model.js";

export const sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  try {
    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new contact submission
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    // Save to database
    await newContact.save();

    return res.status(201).json({ 
    //   success: true,
      message: "Thank you for contacting us! We'll get back to you soon."
    });

  } catch (error) {
    console.log("Error in contact submission: ", error);
    return res.status(500).json({ 
      error: "Something went wrong. Please try again later." 
    });
  }
};