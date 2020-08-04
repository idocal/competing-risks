# serve.R
library(plumber)
r <- plumb("api.R")
r$run(host="0.0.0.0", port=8000)