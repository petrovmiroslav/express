import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { Config } from "../../constants/config";
import formidable from "formidable";
import { z } from "zod";
import Mail from "nodemailer/lib/mailer";

const embeddedImage =
  "data:image/jpeg;base64,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";

const formDataSchema = z.object({
  personName: z
    .string({ required_error: "nameIsNull" })
    .trim()
    .min(2, { message: "nameIsTooShort" }),
  phoneNumber: z.string().trim().optional(),
  email: z.coerce.string().trim().email({ message: "Incorrect email" }),
  info: z.string().trim().max(2000, { message: "infoIsTooLong" }).optional(),
  hidden: z.string().trim().min(1, { message: "error" }),
});

type FormData = z.infer<typeof formDataSchema>;

const getMailBody = (params: {
  site: string;
  myEmail: string;
  personName: string;
  email: string;
  phoneNumber: string;
  info: string;
  copy?: boolean;
}): string => {
  const { site, myEmail, personName, email, phoneNumber, info, copy } = params;
  let body = "";

  if (copy) {
    // noinspection HtmlDeprecatedAttribute
    body = `<tr>
              <td>
                <table style="border-collapse:collapse;margin:0 auto 5px auto;padding:3px 0 3px 0;width:430px" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tbody>
                    <tr>
                      <td style="font-size:18px;margin:0;padding:8px;border:1px solid black;">name</td>
                      <td style="font-size:18px;margin:0;padding:8px;border:1px solid black;">${personName}</td>
                    </tr>
                    <tr>
                      <td style="font-size:18px;margin:0;padding:8px;border:1px solid black;">phone</td>
                      <td style="font-size:18px;margin:0;padding:8px;border:1px solid black;">${phoneNumber}</td>
                    </tr>
                    <tr>
                      <td style="font-size:18px;margin:0;padding:8px;border:1px solid black;">email</td>
                      <td style="font-size:18px;margin:0;padding:8px;border:1px solid black;">${email}</td>
                    </tr>
                    <tr>
                      <td style="font-size:18px;margin:0;padding:8px;border:1px solid black;">info</td>
                      <td style="font-size:18px;margin:0;padding:8px;border:1px solid black;">${info}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>`;
  }
  // noinspection HtmlDeprecatedAttribute
  return `<table style="border-collapse:collapse" cellspacing="0" cellpadding="0" border="0" align="center">
            <tbody>
              <tr>
                <td colspan="3" style="line-height:20px" height="20">&nbsp;</td>
              </tr>
              <tr>
                <td style="width:16px" width="16"></td>
                <td style="background:#F2F2F2;font-family:\'helvetica neue\' , \'helvetica\' , \'roboto\' , \'arial\' , sans-serif">
                  <table style="border-collapse:collapse" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td>
                          <table style="background:#454C59;border-collapse:collapse;margin:0 auto 5px auto;padding:3px 0 3px 0;width:430px;color:#F2F2F2;" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tbody>
                              <tr>
                                <td style="width:100px;padding:8px;">
                                  <img src="cid:img" alt="Miroslav Petrov" border="0" width="100" height="100" style="display:block;border-radius:6px;"/>
                                </td>
                                <td style="padding:8px 0;vertical-align: bottom;">
                                  <table style="border-collapse:collapse" width="100%" cellspacing="0" cellpadding="0" border="0">
                                    <tbody>
                                      <tr>
                                        <td style="padding:0 0 8px;font-size:16px;">Miroslav Petrov</td>
                                      </tr>
                                      <tr>
                                        <td><a href="https://${site}" style="color:#F24B59;text-decoration:none;font-size:14px;" target="_blank" rel="noopener noreferrer">${site}</a></td>
                                      </tr>
                                      <tr>
                                        <td><a href="mailto:${myEmail}" style="color:#F24B59;text-decoration:none;font-size:14px;" target="_blank" rel="noopener noreferrer">${myEmail}</a></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
  
                      <tr>
                        <td>
                          <table style="border-collapse:collapse;margin:0 auto 5px auto;padding:3px 0 3px 0;width:430px" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tbody>
                              <tr>
                                <td style="color:#454C59;font-family:\'helvetica neue\' , \'helvetica\' , \'roboto\' , \'arial\' , sans-serif;font-size:18px;margin:0;padding:64px 8px 0;text-align:center;width:300px">Hello ${personName}!</td>
                              </tr>
                              <tr>
                                <td style="color:#454C59;font-family:\'helvetica neue\' , \'helvetica\' , \'roboto\' , \'arial\' , sans-serif;font-size:16px;margin:0;padding:24px 24px 0;width:300px">Thank you for your email!<br>I will try to answer your letter as soon as possible.</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>${body}
                      <tr>
                        <td>
                          <table style="border-collapse:collapse;margin:0 auto 0 auto;text-align:center;width:430px" width="430" cellspacing="0" cellpadding="0" border="0" align="center">
                            <tbody>
                              <tr>
                                <td style="line-height:48px" height="48">&nbsp;</td>
                              </tr>
                              <tr>
                                <td style="width:100%;border-top-color:#dbdbdb;border-top-style:solid;border-top-width:1px"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
  
                      <tr>
                        <td>
                          <table style="border-collapse:collapse;margin:0 auto 5px auto;padding:3px 0 3px 0;width:430px" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tbody>
                              <tr>
                                <td style="color:#454C59;font-family:\'helvetica neue\' , \'helvetica\' , \'roboto\' , \'arial\' , sans-serif;font-size:11px;margin:0;padding:8px;width:300px">The message was sent because email <a href="#" style="color:#F24B59;text-decoration:none;font-size:11px;" target="_blank" rel="noopener noreferrer">${email}</a> was indicated when filling out the feedback form on the website <a href="https://${site}" style="color:#F24B59;text-decoration:none;font-size:11px;" target="_blank" rel="noopener noreferrer">${site}</a>. If you did not fill out the form, please disregard this letter. I apologize for the inconvenience caused.</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td style="width:16px" width="16"></td>
              </tr>
              <tr>
                <td colspan="3" style="line-height:20px" height="20">&nbsp;</td>
              </tr>
            </tbody>
		  </table>`;
};

const sendMail = async (mailOptions: Mail.Options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: Config.GMAIL_EMAIL,
      pass: Config.GMAIL_PASSWORD,
    },
  });

  return transporter.sendMail(mailOptions);
};

const validateFormFields = (
  fields: unknown
): { success: true; data: FormData } | { success: false; errors: string[] } => {
  const validationResult = formDataSchema.safeParse(fields);

  if (validationResult.success) return validationResult;

  const { formErrors, fieldErrors } = validationResult.error.flatten();

  const fieldErrorList = Object.values(fieldErrors).flat();

  return { success: false, errors: [...formErrors, ...fieldErrorList] };
};

const validateFile = (
  files: formidable.Files
):
  | { success: true; data: formidable.File | null }
  | { success: false; errors: string[] } => {
  const fileList = Object.values(files)
    .flat()
    .filter((file) => file.size);

  const file = fileList[0];

  if (file && file.size > 10485760) {
    return { success: false, errors: ["fileIsTooBig"] };
  }

  return { success: true, data: file || null };
};

type MailerResponse = { error: string[]; send: boolean };

export const mailer = async (req: Request, res: Response): Promise<void> => {
  try {
    const form = formidable();

    form.parse(req, async (err, fields, files) => {
      const response: MailerResponse = { error: [], send: false };

      res.status(400);

      if (err) {
        res.json(response);
        return;
      }

      const fieldsValidationResult = validateFormFields(fields);

      if (!fieldsValidationResult.success) {
        response.error = [...response.error, ...fieldsValidationResult.errors];

        res.json(response);
        return;
      }

      const filesValidationResult = validateFile(files);

      if (!filesValidationResult.success) {
        response.error = [...response.error, ...filesValidationResult.errors];

        res.json(response);
        return;
      }

      const {
        personName,
        phoneNumber = "",
        email,
        info = "",
      } = fieldsValidationResult.data;

      const myEmail = "miroslavpetrov.collaboration@gmail.com";
      const site = Config.MIROSLAV_PETROV_URL;
      const attachments: Mail.Attachment[] = [
        {
          path: embeddedImage,
          cid: "img",
        },
      ];

      const message = {
        from: `Miroslav Petrov <${myEmail}>`,
        replyTo: `Miroslav Petrov <${myEmail}>`,
        to: `${personName} <${email}>`,
        subject: `Dear ${personName}, your message has been received.`,
        text: `Hello ${personName}!\r\nThank you for your email! I will try to answer your letter as soon as possible.\r\n\r\nMiroslav Petrov\r\n\r\n${site}\r\n${myEmail}\r\n\r\n\r\nThe message was sent because email ${email} was indicated when filling out the feedback form on the website ${site}. If you did not fill out the form, please disregard this letter. I apologize for the inconvenience caused.`,
        html: getMailBody({
          site,
          myEmail,
          personName,
          email,
          phoneNumber,
          info,
        }),
        attachments,
      };

      const copyMessage = {
        ...message,
        to: `${personName} <${Config.GMAIL_EMAIL}>`,
        html: getMailBody({
          site,
          myEmail,
          personName,
          email,
          phoneNumber,
          info,
          copy: true,
        }),
      };

      if (filesValidationResult.data) {
        const file = filesValidationResult.data;
        copyMessage.attachments = [
          ...copyMessage.attachments,
          {
            filename: file.originalFilename || "",
            path: file.filepath,
          },
        ];
      }

      await Promise.all([
        sendMail(message),
        //copy to my address
        sendMail(copyMessage),
      ]);

      response.send = true;
      res.status(200).json(response);
    });
  } catch (error) {
    throw error;
  }
};
