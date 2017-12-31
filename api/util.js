var sample_json = {
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
                    command: ["sh", "-c", "mysql -u root -e 'show databases;'"]
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
};

exports.sample_json = sample_json;
