def scrub(content):
  content = content.replace("What's your", "")
  content = content.replace("Login to use TMDB's new rating system.", "")
  content = content.replace("Welcome to Vibes, TMDB's new rating system! For more information, visit the  contribution bible.", "")
  content = content.replace("Looks like we're missing the following data in en-US or en-US...", "")
  content = content.replace("Login to edit", "")
  content = content.replace("Login to report an issue", "")
  return content