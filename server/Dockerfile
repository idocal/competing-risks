FROM rocker/r-ver:4.0.0

RUN apt-get update && apt-get install -y \
  libz-dev \
  pkg-config

WORKDIR /app

RUN Rscript -e "install.packages(c('plyr', 'ROCit', 'data.table', 'ModelMetrics', 'ggplot2', 'tictoc', 'plumber'))"

EXPOSE 8000

CMD ["Rscript", "/app/serve.R"]
