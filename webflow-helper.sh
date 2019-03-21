cd vector.im &&
perl -pi -w -e 's#href="index.html"#href="/"#g;' *.html &&
perl -pi -w -e 's#href="careers.html"#href="/careers"#g;' *.html &&
perl -pi -w -e 's#href="contact-us.html"#href="/contact-us"#g;' *.html &&
perl -pi -w -e 's#href="privacy.html"#href="/privacy"#g;' *.html &&
sed -i '' '/Last Published/d' *.html &&
sed -i '' '/This site was created in Webflow/d' *.html &&
echo "Ancient chinese proverb."
