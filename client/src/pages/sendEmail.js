import React from "react";
import emailjs from "emailjs-com";

export function sendEmail(e) {
  emailjs
    .sendForm(
      "service_vk8oja3",
      "template_6x668um",
      e.target,
      "C156t80TNGGNMhUqM"
    )
    .then((error) => {
      console.log(error.text);
    });
}
