#!/usr/bin/env bash

# exit when any command fails
set -e
cd vector.im

# replace wrong links
perl -pi -w -e 's#href="index.html"#href="/"#g;' -- *.html
perl -pi -w -e 's#href="careers.html"#href="/careers"#g;' -- *.html
perl -pi -w -e 's#href="contact-us.html"#href="/contact-us"#g;' -- *.html
perl -pi -w -e 's#href="privacy.html"#href="/privacy"#g;' -- *.html
perl -pi -w -e 's#href="for-education.html"#href="/for-education"#g;' -- *.html
perl -pi -w -e 's#href="for-healthcare.html"#href="/for-healthcare"#g;' -- *.html
perl -pi -w -e 's#href="for-crisis-response.html"#href="/for-crisis-response"#g;' -- *.html

# remove webflow annotations
sed -i '/Last Published/d' -- *.html
sed -i '/This site was created in Webflow/d' -- *.html

# replace jquery with a local one
perl -pi -w -e 's@<script src=".*?js/jquery.+?</script>@<script src="/js/jquery-3.3.1.min.js" type="text/javascript"></script>@g;' -- *.html

# extract inline javascript sections
while read -r line
do
  hash=$(echo -n "$line" | md5sum | awk '{print $1}')
  jsfile="js/webflow/$hash.js"
  # write out js file
  echo "$line" > "$jsfile"
  # overwrite any matches in all files
  sed -i "s@<script type=\"text/javascript\">$line</script>@<script src=\"$jsfile\" type=\"text/javascript\"></script>@g" -- *.html
done < <(grep -hoP '(?<=<script type="text\/javascript">)(.+?)(?=<\/script>)' -- *.html | sort --unique)

echo "Ancient chinese proverb."
