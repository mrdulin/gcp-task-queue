# task-queue

Task Queue

## Usage

build docker image

```bash
docker build -t tq:1.0 .
```

create `.env` file:

```txt
NODE_ENV=production
PROJECT_ID=<PROJECT ID>
PUBSUB_ADMIN_CREDENTIAL=/secrets/pubsub-admin/pubsub-admin.json
TASK_QUEUE_NAME=google-adwords-task-queue
```
