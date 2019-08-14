echo "Updating Clippy-Music..."
git pull origin master

echo "Updating youtube-dl..."
if sudo pip install youtube-dl --upgrade > /dev/null; then
	echo 'updated using: pip'
else
	if youtube-dl --update > /dev/null; then
		echo 'updated using: youtube-dl --update'
	else
		echo 'update failed'
	fi
fi

echo "Rebuilding Clippy-Music..."
npm run build
