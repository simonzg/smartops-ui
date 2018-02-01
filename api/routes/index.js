var util = require("../util");
var express = require("express");
var router = express.Router();

let apps = [
  {
    updated_at: "2017-12-16 11:44:08",
    created_at: "2017-12-16 11:43:06",
    id: 1,
    name: "app1",

    services: 1,
    pods: 1,
    containers: 2,

    status: { status: "CREATING_STEP_0", message: "" }
  }
];
// List app
router.get("/apps", function(req, res, next) {
  res.json(apps);
});

// Create App
router.post("/apps", (req, res, next) => {
  let id = apps.length + 1;
  let app = {
    updated_at: new Date(),
    created_at: new Date(),
    id: id,
    name: req.body.name,
    status: {
      status: "CREATING_STEP_0",
      message: ""
    }
  };
  apps.push(app);
  // CHANGED: return id instead of noting
  res.json(app);
});
//

// set SLA
router.put("/apps/:app_id/sla", (req, res, next) => {
  // input {
  // sla: { latency: 500, error_rate: 0.5 }
  // }
  res.json({
    latency: 500,
    app_id: 1,
    id: 1,
    error_rate: 0.5
  });
});
router.get("/apps/:app_id", (req, res, next) => {
  res.json({ status: {} });
});
// get blueprint
router.get("/apps/:app_id/raw_blueprint", (req, res, next) => {
  res.send(
    '--- \napiVersion: v1\nkind: Secret\nmetadata:\n  name: dockerhub.registry\ndata:\n  .dockerconfigjson: eyAiYXV0aHMiOiB7ICJodHRwczovL2luZGV4LmRvY2tlci5pby92MS8iOiB7ICJhdXRoIjogIlltbHNiSGw2YUdGdVp6SXdNVEE2U0ZkNmFEZ3lPREl4UUE9PSIgfSB9IH0K\ntype: kubernetes.io/dockerconfigjson\n---\n# A headless service to create DNS records\napiVersion: v1\nkind: Service\nmetadata:\n  annotations:\n    service.alpha.kubernetes.io/tolerate-unready-endpoints: true\n  name: db\n  namespace: acmeair\n  labels:\n    app: mysql\nspec:\n  ports:\n  - port: 3306\n    name: mysql\n  # *.galear.default.svc.cluster.local\n  clusterIP: None\n  selector:\n    app: mysql\n---\napiVersion: apps/v1beta1\nkind: StatefulSet\nmetadata:\n  name: mysql\n  namespace: acmeair\nspec:\n  serviceName: db\n  replicas: 3\n  template:\n    metadata:\n      labels:\n        app: mysql\n      annotations:\n        pod.alpha.kubernetes.io/init-containers: \'[\n            {\n                "name": "install",\n                "image": "jianhuiz/galera-install:0.1",\n                "args": ["--work-dir=/work-dir"],\n                "volumeMounts": [\n                    {\n                        "name": "workdir",\n                        "mountPath": "/work-dir"\n                    },\n                    {\n                        "name": "config",\n                        "mountPath": "/etc/mysql"\n                    }\n                ]\n            },\n            {\n                "name": "bootstrap",\n                "image": "debian:jessie",\n                "command": ["/work-dir/peer-finder"],\n                "args": ["-on-start=\\"/work-dir/on-start.sh\\"", "-service=db"],\n                "env": [\n                  {\n                      "name": "POD_NAMESPACE",\n                      "valueFrom": {\n                          "fieldRef": {\n                              "apiVersion": "v1",\n                              "fieldPath": "metadata.namespace"\n                          }\n                      }\n                   }\n                ],\n                "volumeMounts": [\n                    {\n                        "name": "workdir",\n                        "mountPath": "/work-dir"\n                    },\n                    {\n                        "name": "config",\n                        "mountPath": "/etc/mysql"\n                    }\n                ]\n            }\n        ]\'\n    spec:\n      nodeSelector:\n        stack: acmeair\n      containers:\n      - name: mysql\n        image: jianhuiz/mysql-galera:e2e\n        ports:\n        - containerPort: 3306\n          name: mysql\n        - containerPort: 4444\n          name: sst\n        - containerPort: 4567\n          name: replication\n        - containerPort: 4568\n          name: ist\n        args:\n        - --defaults-file=/etc/mysql/my-galera.cnf\n        - --user=root\n        readinessProbe:\n          # TODO: If docker exec is buggy just use gcr.io/google_containers/mysql-healthz:1.0\n          exec:\n            command:\n            - sh\n            - -c\n            - mysql -u root -e \'show databases;\'\n          initialDelaySeconds: 15\n          timeoutSeconds: 5\n          successThreshold: 2\n        volumeMounts:\n        - name: datadir\n          mountPath: /var/lib/\n        - name: config\n          mountPath: /etc/mysql\n      volumes:\n      - name: config\n        emptyDir: {}\n      - name: workdir\n        emptyDir: {}\n      - name: datadir\n        emptyDir: {}\n  # volumeClaimTemplates:\n  # - metadata:\n  #     name: datadir\n  #     #annotations:\n  #     #  volume.beta.kubernetes.io/storage-class: example-nfs\n  #   spec:\n  #     accessModes: [ ReadWriteOnce ]\n  #     resources:\n  #       requests:\n  #         storage: 1Gi\n---\napiVersion: batch/v1\nkind: Job\nmetadata:\n  name: acmeairdbloader\n  namespace: acmeair\nspec:\n  template:\n    metadata:\n      name: acmeair-dbloader\n    spec:\n      restartPolicy: Never\n      imagePullSecrets:\n      - name: dockerhub.registry\n      nodeSelector:\n        stack: acmeair\n      containers:\n      - name: acmeair-dbloader\n        image: autoshift/mysql-loader:0.3\n        env:\n          - name: MYSQL_PORT_3306_TCP_ADDR\n            value: db\n          - name: MYSQL_ENV_MYSQL_ROOT_PASSWORD\n            value: root\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: acmeairapp\n  namespace: acmeair\nspec:\n  ports:\n  - port: 8080\n    targetPort: 8080\n    protocol: TCP\n    name: http\n  selector:\n    name: webpods\n---\napiVersion: v1\nkind: ReplicationController\nmetadata:\n  name: webrc\n  namespace: acmeair\nspec:\n  replicas: 1\n  selector:\n    name: webpods\n  template:\n    metadata:\n      labels:\n        name: webpods\n        tier: frontend\n    spec:\n      restartPolicy: Always\n      imagePullSecrets:\n      - name: dockerhub.registry\n      nodeSelector:\n        stack: acmeair\n      # nodeSelector:\n      #   eip : unbonded\n      #   region: cn-north-1\n      #   provider: hwcloud\n      #   stack: app1_dryrun\n      containers:\n      - image: autoshift/apps_acmeair:latest\n        name: web\n        ports:\n        - containerPort: 8080\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: nginx\n  namespace: acmeair\nspec:\n  type: NodePort\n  ports:\n  - port: 80\n    targetPort: 80\n    nodePort: 30180\n    protocol: TCP\n    name: nginx0\n  selector:\n    name: nginxpo\n---\napiVersion: v1\nkind: ReplicationController\nmetadata:\n  name: nginxrc\n  namespace: acmeair\nspec:\n  replicas: 1\n  selector:\n    name: nginxpo\n  template:\n    metadata:\n      labels:\n        name: nginxpo\n    spec:\n      restartPolicy: Always\n      imagePullSecrets:\n      - name: dockerhub.registry\n      nodeSelector:\n        stack: acmeair\n      # nodeSelector:\n      #   eip : bonded\n      #   region: cn-north-1\n      #   provider: hwcloud\n      #   stack: app1_dryrun\n      containers:\n      - name: nginx\n        image: zhaohc10/webaccess-analyzer:0.2\n        env:\n        - name: BACKEND_SVC_IP\n          value: acmeairapp\n        - name: BACKEND_SVC_PORT\n          value: 8080\n        - name: INFLUXDB_URL\n          #value: https://influxdb.autoshift.us\n          value: http://influxdb.default:8086\n        - name: INFLUXDB_AUTH\n          value: autoshift:influx4autoshift\n        - name: KAFKA_BOOTSTRAP_SERVERS\n          value: kafka.default.svc.cluster.local:9092\n        - name: APP_NAME\n          value: acmeair-\n        resources:\n          requests:\n            cpu: 500m\n            memory: 512Mi\n        volumeMounts:\n        - name: nginxdata\n          mountPath: /var/log/nginx/\n        imagePullPolicy: Always\n        ports:\n        - containerPort: 80\n        - containerPort: 443\n      volumes:\n      - name: nginxdata\n        hostPath:\n          path: /var/nginx-out/log/\n'
  );
});

// save blueprint
router.put("/apps/:app_id/blueprint", (req, res, next) => {
  // input:
  // {content: ".....yaml"}
  res.json(util.sample_blueprint);
});

// get blueprint json
router.get("/apps/:app_id/blueprint", (req, res, next) => {
  res.json(util.sample_blueprint);
});

// set test plan
router.put("/apps/:app_id", (req, res, next) => {
  // input:
  // {"test_plan":{"url":"http://smartops.io/acmeair", "counts":5}

  res.json({
    updated_at: "2017-12-16 18:32:05",
    created_at: "2017-12-16 17:52:50",
    test_plan: {
      url: "http://smartops.io/acmeair",
      load: 5,
      method: "get",
      header: "application/json",
      body: ""
    },
    id: 1,
    name: "app"
  });
});

// get dry run plan
router.get("/apps/:app_id/dryrun_base_plan", (req, res, next) => {
  res.json(util.dryrun_base_plan);
});

router.get("/apps/:app_id/dry_run_result", (req, res, next) => {
  res.json(util.dryrun_result);
});

// trigger dry run plan
router.post("/apps/:app_id/dryrun", (req, res, next) => {
  //?
});

module.exports = router;
