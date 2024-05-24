const fs = require("fs");
const path = require("path");

exports.loadTemplateAndSend = async function (templateName, args) {
  try {
    let htmlContent = fs
      .readFileSync(
        path.join(__dirname, "../emailTemplates/", templateName, "/body.html")
      )
      .toString();

    let txtContent = fs
      .readFileSync(
        path.join(__dirname, "../emailTemplates/", templateName, "/body.txt")
      )
      .toString();

    let subject = fs
      .readFileSync(
        path.join(__dirname, "../emailTemplates/", templateName, "/subject.txt")
      )
      .toString();

    // Modify txtContent here for better deliverability
    txtContent = `Hello ${args.fullName},\n\nPlease verify your email address by clicking on the link below:\n${args.link}\n\nIf you did not request this verification, please ignore this email.\n\nThank you!`;

    htmlContent = replaceArgs(htmlContent, args);
    txtContent = replaceArgs(txtContent, args);
    subject = replaceArgs(subject, args);

    return {
      to: args.email,
      subject,
      txtContent,
      htmlContent,
    };
  } catch (e) {
    throw e;
  }
};


function replaceArgs(source, args) {
  if (!args) {
    return source;
  }

  const tags = Object.keys(args);
  for (const tag of tags) {
    source = source.replace(new RegExp(`{{${tag}}}`, "gi"), args[tag]);
  }

  return source;
}
