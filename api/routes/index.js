var express = require("express");
var router = express.Router();

// List app
router.get("/apps", function(req, res, next) {
  res.json([
    {
      updated_at: "2017-12-16 11:44:08",
      created_at: "2017-12-16 11:43:06",
      id: 1,
      name: "app1",
      status: { status: "CREATING_STEP_0", message: "" }
    }
  ]);
});

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

// get blueprint
router.get("/apps/:app_id/blueprint", (req, res, next) => {
  res.json({
    content:
      '--- \napiVersion: v1\nkind: Secret\nmetadata:\n  name: dockerhub.registry\ndata:\n  .dockerconfigjson: eyAiYXV0aHMiOiB7ICJodHRwczovL2luZGV4LmRvY2tlci5pby92MS8iOiB7ICJhdXRoIjogIlltbHNiSGw2YUdGdVp6SXdNVEE2U0ZkNmFEZ3lPREl4UUE9PSIgfSB9IH0K\ntype: kubernetes.io/dockerconfigjson\n---\n# A headless service to create DNS records\napiVersion: v1\nkind: Service\nmetadata:\n  annotations:\n    service.alpha.kubernetes.io/tolerate-unready-endpoints: true\n  name: db\n  namespace: acmeair\n  labels:\n    app: mysql\nspec:\n  ports:\n  - port: 3306\n    name: mysql\n  # *.galear.default.svc.cluster.local\n  clusterIP: None\n  selector:\n    app: mysql\n---\napiVersion: apps/v1beta1\nkind: StatefulSet\nmetadata:\n  name: mysql\n  namespace: acmeair\nspec:\n  serviceName: db\n  replicas: 3\n  template:\n    metadata:\n      labels:\n        app: mysql\n      annotations:\n        pod.alpha.kubernetes.io/init-containers: \'[\n            {\n                "name": "install",\n                "image": "jianhuiz/galera-install:0.1",\n                "args": ["--work-dir=/work-dir"],\n                "volumeMounts": [\n                    {\n                        "name": "workdir",\n                        "mountPath": "/work-dir"\n                    },\n                    {\n                        "name": "config",\n                        "mountPath": "/etc/mysql"\n                    }\n                ]\n            },\n            {\n                "name": "bootstrap",\n                "image": "debian:jessie",\n                "command": ["/work-dir/peer-finder"],\n                "args": ["-on-start=\\"/work-dir/on-start.sh\\"", "-service=db"],\n                "env": [\n                  {\n                      "name": "POD_NAMESPACE",\n                      "valueFrom": {\n                          "fieldRef": {\n                              "apiVersion": "v1",\n                              "fieldPath": "metadata.namespace"\n                          }\n                      }\n                   }\n                ],\n                "volumeMounts": [\n                    {\n                        "name": "workdir",\n                        "mountPath": "/work-dir"\n                    },\n                    {\n                        "name": "config",\n                        "mountPath": "/etc/mysql"\n                    }\n                ]\n            }\n        ]\'\n    spec:\n      nodeSelector:\n        stack: acmeair\n      containers:\n      - name: mysql\n        image: jianhuiz/mysql-galera:e2e\n        ports:\n        - containerPort: 3306\n          name: mysql\n        - containerPort: 4444\n          name: sst\n        - containerPort: 4567\n          name: replication\n        - containerPort: 4568\n          name: ist\n        args:\n        - --defaults-file=/etc/mysql/my-galera.cnf\n        - --user=root\n        readinessProbe:\n          # TODO: If docker exec is buggy just use gcr.io/google_containers/mysql-healthz:1.0\n          exec:\n            command:\n            - sh\n            - -c\n            - mysql -u root -e \'show databases;\'\n          initialDelaySeconds: 15\n          timeoutSeconds: 5\n          successThreshold: 2\n        volumeMounts:\n        - name: datadir\n          mountPath: /var/lib/\n        - name: config\n          mountPath: /etc/mysql\n      volumes:\n      - name: config\n        emptyDir: {}\n      - name: workdir\n        emptyDir: {}\n      - name: datadir\n        emptyDir: {}\n  # volumeClaimTemplates:\n  # - metadata:\n  #     name: datadir\n  #     #annotations:\n  #     #  volume.beta.kubernetes.io/storage-class: example-nfs\n  #   spec:\n  #     accessModes: [ ReadWriteOnce ]\n  #     resources:\n  #       requests:\n  #         storage: 1Gi\n---\napiVersion: batch/v1\nkind: Job\nmetadata:\n  name: acmeairdbloader\n  namespace: acmeair\nspec:\n  template:\n    metadata:\n      name: acmeair-dbloader\n    spec:\n      restartPolicy: Never\n      imagePullSecrets:\n      - name: dockerhub.registry\n      nodeSelector:\n        stack: acmeair\n      containers:\n      - name: acmeair-dbloader\n        image: autoshift/mysql-loader:0.3\n        env:\n          - name: MYSQL_PORT_3306_TCP_ADDR\n            value: db\n          - name: MYSQL_ENV_MYSQL_ROOT_PASSWORD\n            value: root\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: acmeairapp\n  namespace: acmeair\nspec:\n  ports:\n  - port: 8080\n    targetPort: 8080\n    protocol: TCP\n    name: http\n  selector:\n    name: webpods\n---\napiVersion: v1\nkind: ReplicationController\nmetadata:\n  name: webrc\n  namespace: acmeair\nspec:\n  replicas: 1\n  selector:\n    name: webpods\n  template:\n    metadata:\n      labels:\n        name: webpods\n        tier: frontend\n    spec:\n      restartPolicy: Always\n      imagePullSecrets:\n      - name: dockerhub.registry\n      nodeSelector:\n        stack: acmeair\n      # nodeSelector:\n      #   eip : unbonded\n      #   region: cn-north-1\n      #   provider: hwcloud\n      #   stack: app1_dryrun\n      containers:\n      - image: autoshift/apps_acmeair:latest\n        name: web\n        ports:\n        - containerPort: 8080\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: nginx\n  namespace: acmeair\nspec:\n  type: NodePort\n  ports:\n  - port: 80\n    targetPort: 80\n    nodePort: 30180\n    protocol: TCP\n    name: nginx0\n  selector:\n    name: nginxpo\n---\napiVersion: v1\nkind: ReplicationController\nmetadata:\n  name: nginxrc\n  namespace: acmeair\nspec:\n  replicas: 1\n  selector:\n    name: nginxpo\n  template:\n    metadata:\n      labels:\n        name: nginxpo\n    spec:\n      restartPolicy: Always\n      imagePullSecrets:\n      - name: dockerhub.registry\n      nodeSelector:\n        stack: acmeair\n      # nodeSelector:\n      #   eip : bonded\n      #   region: cn-north-1\n      #   provider: hwcloud\n      #   stack: app1_dryrun\n      containers:\n      - name: nginx\n        image: zhaohc10/webaccess-analyzer:0.2\n        env:\n        - name: BACKEND_SVC_IP\n          value: acmeairapp\n        - name: BACKEND_SVC_PORT\n          value: 8080\n        - name: INFLUXDB_URL\n          #value: https://influxdb.autoshift.us\n          value: http://influxdb.default:8086\n        - name: INFLUXDB_AUTH\n          value: autoshift:influx4autoshift\n        - name: KAFKA_BOOTSTRAP_SERVERS\n          value: kafka.default.svc.cluster.local:9092\n        - name: APP_NAME\n          value: acmeair-\n        resources:\n          requests:\n            cpu: 500m\n            memory: 512Mi\n        volumeMounts:\n        - name: nginxdata\n          mountPath: /var/log/nginx/\n        imagePullPolicy: Always\n        ports:\n        - containerPort: 80\n        - containerPort: 443\n      volumes:\n      - name: nginxdata\n        hostPath:\n          path: /var/nginx-out/log/\n'
  });
});

// set blueprint
router.post("/apps/<int:app_id>/blueprint", (req, res, next) => {
  // input:
  // {content: ".....yaml"}
  res.json({
    content: [
      {
        data: {
          ".dockerconfigjson":
            "eyAiYXV0aHMiOiB7ICJodHRwczovL2luZGV4LmRvY2tlci5pby92MS8iOiB7ICJhdXRoIjogIlltbHNiSGw2YUdGdVp6SXdNVEE2U0ZkNmFEZ3lPREl4UUE9PSIgfSB9IH0K"
        },
        kind: "Secret",
        type: "kubernetes.io/dockerconfigjson",
        apiVersion: "v1",
        metadata: {
          name: "dockerhub.registry"
        }
      },
      {
        kind: "Service",
        spec: {
          clusterIP: "None",
          ports: [
            {
              port: 3306,
              name: "mysql"
            }
          ],
          selector: {
            app: "mysql"
          }
        },
        apiVersion: "v1",
        metadata: {
          labels: {
            app: "mysql"
          },
          namespace: "acmeair",
          annotations: {
            "service.alpha.kubernetes.io/tolerate-unready-endpoints": true
          },
          name: "db"
        }
      },
      {
        kind: "StatefulSet",
        spec: {
          serviceName: "db",
          template: {
            spec: {
              containers: [
                {
                  name: "mysql",
                  readinessProbe: {
                    successThreshold: 2,
                    initialDelaySeconds: 15,
                    timeoutSeconds: 5,
                    exec: {
                      command: [
                        "sh",
                        "-c",
                        "mysql -u root -e 'show databases;'"
                      ]
                    }
                  },
                  image: "jianhuiz/mysql-galera:e2e",
                  args: [
                    "--defaults-file=/etc/mysql/my-galera.cnf",
                    "--user=root"
                  ],
                  volumeMounts: [
                    {
                      mountPath: "/var/lib/",
                      name: "datadir"
                    },
                    {
                      mountPath: "/etc/mysql",
                      name: "config"
                    }
                  ],
                  ports: [
                    {
                      containerPort: 3306,
                      name: "mysql"
                    },
                    {
                      containerPort: 4444,
                      name: "sst"
                    },
                    {
                      containerPort: 4567,
                      name: "replication"
                    },
                    {
                      containerPort: 4568,
                      name: "ist"
                    }
                  ]
                }
              ],
              volumes: [
                {
                  emptyDir: {},
                  name: "config"
                },
                {
                  emptyDir: {},
                  name: "workdir"
                },
                {
                  emptyDir: {},
                  name: "datadir"
                }
              ],
              nodeSelector: {
                stack: "acmeair"
              }
            },
            metadata: {
              labels: {
                app: "mysql"
              },
              annotations: {
                "pod.alpha.kubernetes.io/init-containers":
                  '[ { "name": "install", "image": "jianhuiz/galera-install:0.1", "args": ["--work-dir=/work-dir"], "volumeMounts": [ { "name": "workdir", "mountPath": "/work-dir" }, { "name": "config", "mountPath": "/etc/mysql" } ] }, { "name": "bootstrap", "image": "debian:jessie", "command": ["/work-dir/peer-finder"], "args": ["-on-start=\\"/work-dir/on-start.sh\\"", "-service=db"], "env": [ { "name": "POD_NAMESPACE", "valueFrom": { "fieldRef": { "apiVersion": "v1", "fieldPath": "metadata.namespace" } } } ], "volumeMounts": [ { "name": "workdir", "mountPath": "/work-dir" }, { "name": "config", "mountPath": "/etc/mysql" } ] } ]'
              }
            }
          },
          replicas: 3
        },
        apiVersion: "apps/v1beta1",
        metadata: {
          namespace: "acmeair",
          name: "mysql"
        }
      },
      {
        kind: "Job",
        spec: {
          template: {
            spec: {
              restartPolicy: "Never",
              imagePullSecrets: [
                {
                  name: "dockerhub.registry"
                }
              ],
              containers: [
                {
                  image: "autoshift/mysql-loader:0.3",
                  name: "acmeair-dbloader",
                  env: [
                    {
                      name: "MYSQL_PORT_3306_TCP_ADDR",
                      value: "db"
                    },
                    {
                      name: "MYSQL_ENV_MYSQL_ROOT_PASSWORD",
                      value: "root"
                    }
                  ]
                }
              ],
              nodeSelector: {
                stack: "acmeair"
              }
            },
            metadata: {
              name: "acmeair-dbloader"
            }
          }
        },
        apiVersion: "batch/v1",
        metadata: {
          namespace: "acmeair",
          name: "acmeairdbloader"
        }
      },
      {
        kind: "Service",
        spec: {
          ports: [
            {
              targetPort: 8080,
              protocol: "TCP",
              port: 8080,
              name: "http"
            }
          ],
          selector: {
            name: "webpods"
          }
        },
        apiVersion: "v1",
        metadata: {
          namespace: "acmeair",
          name: "acmeairapp"
        }
      },
      {
        kind: "ReplicationController",
        spec: {
          replicas: 1,
          template: {
            spec: {
              restartPolicy: "Always",
              imagePullSecrets: [
                {
                  name: "dockerhub.registry"
                }
              ],
              containers: [
                {
                  image: "autoshift/apps_acmeair:latest",
                  name: "web",
                  ports: [
                    {
                      containerPort: 8080
                    }
                  ]
                }
              ],
              nodeSelector: {
                stack: "acmeair"
              }
            },
            metadata: {
              labels: {
                tier: "frontend",
                name: "webpods"
              }
            }
          },
          selector: {
            name: "webpods"
          }
        },
        apiVersion: "v1",
        metadata: {
          namespace: "acmeair",
          name: "webrc"
        }
      },
      {
        kind: "Service",
        spec: {
          type: "NodePort",
          ports: [
            {
              targetPort: 80,
              protocol: "TCP",
              port: 80,
              nodePort: 30180,
              name: "nginx0"
            }
          ],
          selector: {
            name: "nginxpo"
          }
        },
        apiVersion: "v1",
        metadata: {
          namespace: "acmeair",
          name: "nginx"
        }
      },
      {
        kind: "ReplicationController",
        spec: {
          replicas: 1,
          template: {
            spec: {
              restartPolicy: "Always",
              containers: [
                {
                  name: "nginx",
                  env: [
                    {
                      name: "BACKEND_SVC_IP",
                      value: "acmeairapp"
                    },
                    {
                      name: "BACKEND_SVC_PORT",
                      value: 8080
                    },
                    {
                      name: "INFLUXDB_URL",
                      value: "http://influxdb.default:8086"
                    },
                    {
                      name: "INFLUXDB_AUTH",
                      value: "autoshift:influx4autoshift"
                    },
                    {
                      name: "KAFKA_BOOTSTRAP_SERVERS",
                      value: "kafka.default.svc.cluster.local:9092"
                    },
                    {
                      name: "APP_NAME",
                      value: "acmeair-"
                    }
                  ],
                  imagePullPolicy: "Always",
                  image: "zhaohc10/webaccess-analyzer:0.2",
                  volumeMounts: [
                    {
                      mountPath: "/var/log/nginx/",
                      name: "nginxdata"
                    }
                  ],
                  ports: [
                    {
                      containerPort: 80
                    },
                    {
                      containerPort: 443
                    }
                  ],
                  resources: {
                    requests: {
                      cpu: "500m",
                      memory: "512Mi"
                    }
                  }
                }
              ],
              imagePullSecrets: [
                {
                  name: "dockerhub.registry"
                }
              ],
              volumes: [
                {
                  hostPath: {
                    path: "/var/nginx-out/log/"
                  },
                  name: "nginxdata"
                }
              ],
              nodeSelector: {
                stack: "acmeair"
              }
            },
            metadata: {
              labels: {
                name: "nginxpo"
              }
            }
          },
          selector: {
            name: "nginxpo"
          }
        },
        apiVersion: "v1",
        metadata: {
          namespace: "acmeair",
          name: "nginxrc"
        }
      }
    ],
    entrypoints: ["db", "acmeairapp", "nginx"],
    id: 1,
    app_id: 1
  });
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
      counts: 5
    },
    id: 1,
    name: "app"
  });
});

// get dry run plan
router.get("/apps/<int:app_id>/dryrun_plan", (req, res, next) => {
  //?
});

// trigger dry run plan
router.post("/apps/<int:app_id>/dryrun", (req, res, next) => {
  //?
});

// download dry run result
router.put("/apps/:app_id", (req, res, next) => {
  //?
});

module.exports = router;
