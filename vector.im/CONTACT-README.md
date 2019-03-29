# Contact Form (contact.php)

PHP Backend for the contact form on https://vector.im. Ingests data from the
form and then sends an email to the specified email address. Uses `sendmail`
to actually send mail.

## Setup

Edit `config.php` and change values as necessary.

Email headers, using variable names from the config file, end up in the form of:

```
Sender: $forwarding_email
From: John Doe via vector.im <john@doe.com>
Reply-To: John Doe <john@doe.com>
To: $forwarding_name <$forwarding_email>
```

Ensure you have `sendmail` set up correctly on your server and that PHP is able to use it.

Requires PHP 5+.

## Usage

`contact.php` accepts `POST` requires with the query parameters `namsndkjjkba`, `emaksjkbkjad` and `enqkjadskbnz`.

A `400` is returned if missing query parameters, a `500` is returned if missing config values, and a `200` with message `success` is returned on success.
