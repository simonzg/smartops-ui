var sample_blueprint = {
  content: [
    {
      type: "kubernetes.io/dockerconfigjson",
      kind: "Secret",
      data: {
        ".dockerconfigjson":
          "eyAiYXV0aHMiOiB7ICJodHRwczovL2luZGV4LmRvY2tlci5pby92MS8iOiB7ICJhdXRoIjogIlltbHNiSGw2YUdGdVp6SXdNVEE2U0ZkNmFEZ3lPREl4UUE9PSIgfSB9IH0K"
      },
      apiVersion: "v1",
      metadata: { name: "dockerhub.registry" }
    },
    {
      kind: "Service",
      spec: {
        clusterIP: "None",
        ports: [{ port: 3306, name: "mysql" }],
        selector: { app: "mysql" }
      },
      apiVersion: "v1",
      metadata: {
        labels: { app: "mysql" },
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
            volumes: [
              { emptyDir: {}, name: "config" },
              { emptyDir: {}, name: "workdir" },
              { emptyDir: {}, name: "datadir" }
            ],
            containers: [
              {
                name: "mysql",
                image: "10.145.88.66:5000/demo/mysql-galera",
                args: [
                  "--defaults-file=/etc/mysql/my-galera.cnf",
                  "--user=root"
                ],
                volumeMounts: [
                  { mountPath: "/var/lib/", name: "datadir" },
                  { mountPath: "/etc/mysql", name: "config" }
                ],
                readinessProbe: {
                  successThreshold: 2,
                  initialDelaySeconds: 15,
                  timeoutSeconds: 5,
                  exec: {
                    command: ["sh", "-c", "mysql -u root -e 'show databases;'"]
                  }
                },
                ports: [
                  { containerPort: 3306, name: "mysql" },
                  { containerPort: 4444, name: "sst" },
                  { containerPort: 4567, name: "replication" },
                  { containerPort: 4568, name: "ist" }
                ]
              }
            ],
            nodeSelector: { stack: "acmeair" }
          },
          metadata: {
            labels: { app: "mysql" },
            annotations: {
              "pod.alpha.kubernetes.io/init-containers":
                '[ { "name": "install", "image": "10.145.88.66:5000/demo/smartops/webaccess-analyzer", "args": ["--work-dir=/work-dir"], "volumeMounts": [ { "name": "workdir", "mountPath": "/work-dir" }, { "name": "config", "mountPath": "/etc/mysql" } ] }, { "name": "bootstrap", "image": "10.145.88.146:5000/demo/debian:jessie", "command": ["/work-dir/peer-finder"], "args": ["-on-start=\\"/work-dir/on-start.sh\\"", "-service=db"], "env": [ { "name": "POD_NAMESPACE", "valueFrom": { "fieldRef": { "apiVersion": "v1", "fieldPath": "metadata.namespace" } } } ], "volumeMounts": [ { "name": "workdir", "mountPath": "/work-dir" }, { "name": "config", "mountPath": "/etc/mysql" } ] } ]'
            }
          }
        },
        replicas: 3
      },
      apiVersion: "apps/v1beta1",
      metadata: { namespace: "acmeair", name: "mysql" }
    },
    {
      kind: "Job",
      spec: {
        template: {
          spec: {
            restartPolicy: "Never",
            imagePullSecrets: [{ name: "dockerhub.registry" }],
            containers: [
              {
                image: "10.145.88.66:5000/demo/smartops/mysql-loader",
                name: "acmeair-dbloader",
                env: [
                  { name: "MYSQL_PORT_3306_TCP_ADDR", value: "db" },
                  { name: "MYSQL_ENV_MYSQL_ROOT_PASSWORD", value: "root" }
                ]
              }
            ],
            nodeSelector: { stack: "acmeair" }
          },
          metadata: { name: "acmeair-dbloader" }
        }
      },
      apiVersion: "batch/v1",
      metadata: { namespace: "acmeair", name: "acmeairdbloader" }
    },
    {
      kind: "Service",
      spec: {
        ports: [
          { protocol: "TCP", targetPort: 8080, port: 8080, name: "http" }
        ],
        selector: { name: "webpods" }
      },
      apiVersion: "v1",
      metadata: { namespace: "acmeair", name: "acmeairapp" }
    },
    {
      kind: "ReplicationController",
      spec: {
        selector: { name: "webpods" },
        template: {
          spec: {
            restartPolicy: "Always",
            imagePullSecrets: [{ name: "dockerhub.registry" }],
            containers: [
              {
                image: "10.145.88.66:5000/demo/smartops/apps_acmeair",
                name: "web",
                ports: [{ containerPort: 8080 }]
              }
            ],
            nodeSelector: { stack: "acmeair" }
          },
          metadata: { labels: { tier: "frontend", name: "webpods" } }
        },
        replicas: 1
      },
      apiVersion: "v1",
      metadata: { namespace: "acmeair", name: "webrc" }
    },
    {
      kind: "Service",
      spec: {
        type: "NodePort",
        ports: [
          {
            protocol: "TCP",
            targetPort: 80,
            port: 80,
            name: "nginx0",
            nodePort: 30180
          }
        ],
        selector: { name: "nginxpo" }
      },
      apiVersion: "v1",
      metadata: { namespace: "acmeair", name: "nginx" }
    },
    {
      kind: "ReplicationController",
      spec: {
        selector: { name: "nginxpo" },
        template: {
          spec: {
            volumes: [
              { hostPath: { path: "/var/nginx-out/log/" }, name: "nginxdata" }
            ],
            restartPolicy: "Always",
            imagePullSecrets: [{ name: "dockerhub.registry" }],
            containers: [
              {
                name: "nginx",
                image: "10.145.88.66:5000/demo/smartops/webaccess-analyzer:0.4",
                volumeMounts: [
                  { mountPath: "/var/log/nginx/", name: "nginxdata" }
                ],
                env: [
                  { name: "BACKEND_SVC_IP", value: "acmeairapp" },
                  { name: "BACKEND_SVC_PORT", value: 8080 },
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
                  { name: "APP_NAME", value: "acmeair-" }
                ],
                imagePullPolicy: "Always",
                ports: [{ containerPort: 80 }, { containerPort: 443 }],
                resources: { requests: { cpu: "500m", memory: "512Mi" } }
              }
            ],
            nodeSelector: { stack: "acmeair" }
          },
          metadata: { labels: { name: "nginxpo" } }
        },
        replicas: 1
      },
      apiVersion: "v1",
      metadata: { namespace: "acmeair", name: "nginxrc" }
    }
  ],
  entrypoints: ["db", "acmeairapp", "nginx"],
  topology: {
    db: { service_name: "db", replica: 3 },
    nginxpo: { service_name: "nginx", replica: 1 },
    webpods: { service_name: "acmeairapp", replica: 1 }
  },
  id: 2,
  app_id: 2
};

var dryrun_result = {
  setconfig_selectors: [
    {
      kind: "StatefulSet",
      name: "mysql",
      containers: [
        {
          attributes: [
            {
              display_name: "cpu_quota",
              selector: "cpu_quota"
            },
            {
              display_name: "Memory",
              selector: "mem_limit"
            }
          ],
          selector: "mysql"
        }
      ]
    },
    {
      kind: "Deployment",
      name: "webrc",
      containers: [
        {
          attributes: [
            {
              display_name: "cpu_quota",
              selector: "cpu_quota"
            },
            {
              display_name: "Memory",
              selector: "mem_limit"
            }
          ],
          selector: "web"
        }
      ]
    }
  ],
  capacity_plans: [
    {
      status: "COMPLETED",
      is_auto: true,
      created: "2018-01-22T18:33:26Z",
      demand_profile_id: 11,
      SetConfigs: [
        {
          podConfig: {
            containersConfig: {
              mysql: {
                mem_limit: 1073741824,
                cpu_quota: 1000000
              }
            }
          },
          kind: "StatefulSet",
          replicas: 1,
          id: 1,
          name: "mysql"
        },
        {
          podConfig: {
            containersConfig: {
              web: {
                mem_limit: 1073741824,
                cpu_quota: 1000000
              }
            }
          },
          kind: "Deployment",
          replicas: 1,
          id: 2,
          name: "webrc"
        }
      ],
      message: "Validated 3 optimal plans.",
      k8s_endpoint_id: 1,
      id: 19,
      name: "Autoshift"
    },
    {
      status: "COMPLETED",
      is_auto: false,
      created: "2018-01-22T18:33:26Z",
      demand_profile_id: 11,
      SetConfigs: [
        {
          podConfig: {
            containersConfig: {
              mysql: {
                mem_limit: 1073741824,
                cpu_quota: 1000000
              }
            }
          },
          kind: "StatefulSet",
          replicas: 1,
          id: 1,
          name: "mysql"
        },
        {
          podConfig: {
            containersConfig: {
              web: {
                mem_limit: 1073741824,
                cpu_quota: 1000000
              }
            }
          },
          kind: "Deployment",
          replicas: 1,
          id: 2,
          name: "webrc"
        }
      ],
      message: "Average error rate (63.10532%) is beyond desired: 30.0%)",
      k8s_endpoint_id: 1,
      id: 20,
      name: "Manual Plan"
    }
  ],
  app_name: "shenzhen_demo_1",
  auto_plan_message: "Validated 3 optimal plans.",
  auto_plans: [
    {
      plan_id: 19,
      created: "2018-01-29T23:49:27Z",
      sla_status: "SLA_OPTIMIZED",
      demand_profile_id: 11,
      SetConfigs: [
        {
          podConfig: {
            containersConfig: {
              mysql: {
                mem_limit: 1879048192,
                cpu_quota: 1750000
              }
            }
          },
          kind: "StatefulSet",
          name: "mysql",
          replicas: 1
        },
        {
          podConfig: {
            containersConfig: {
              web: {
                mem_limit: 1073741824,
                cpu_quota: 1750000
              }
            }
          },
          kind: "Deployment",
          name: "webrc",
          replicas: 7
        }
      ],
      sla_result: {
        error_rate: 31.303576,
        cost: 131.57487,
        currency_type: "dollar",
        latency: 2068
      },
      k8s_endpoint_id: 1,
      id: 78
    },
    {
      plan_id: 19,
      created: "2018-01-30T00:09:40Z",
      sla_status: "SLA_OPTIMIZED",
      demand_profile_id: 11,
      SetConfigs: [
        {
          podConfig: {
            containersConfig: {
              mysql: {
                mem_limit: 1342177280,
                cpu_quota: 1750000
              }
            }
          },
          kind: "StatefulSet",
          name: "mysql",
          replicas: 1
        },
        {
          podConfig: {
            containersConfig: {
              web: {
                mem_limit: 1073741824,
                cpu_quota: 1750000
              }
            }
          },
          kind: "Deployment",
          name: "webrc",
          replicas: 7
        }
      ],
      sla_result: {
        error_rate: 34.61252,
        cost: 126.93632,
        currency_type: "dollar",
        latency: 892
      },
      k8s_endpoint_id: 1,
      id: 79
    },
    {
      plan_id: 19,
      created: "2018-01-30T00:14:04Z",
      sla_status: "SLA_OPTIMIZED",
      demand_profile_id: 11,
      SetConfigs: [
        {
          podConfig: {
            containersConfig: {
              mysql: {
                mem_limit: 1879048192,
                cpu_quota: 1500000
              }
            }
          },
          kind: "StatefulSet",
          name: "mysql",
          replicas: 1
        },
        {
          podConfig: {
            containersConfig: {
              web: {
                mem_limit: 536870912,
                cpu_quota: 1750000
              }
            }
          },
          kind: "Deployment",
          name: "webrc",
          replicas: 7
        }
      ],
      sla_result: {
        error_rate: 37.5671,
        cost: 93.21096,
        currency_type: "dollar",
        latency: 1892
      },
      k8s_endpoint_id: 1,
      id: 80
    }
  ],
  id: 6,
  auto_plan_status: "COMPLETED",
  manual_plans: [
    {
      plan_id: 20,
      created: "2018-01-26T01:51:56Z",
      sla_status: "LARGE_ERROR_RATE",
      demand_profile_id: 11,
      sla_result: {
        error_rate: 63.10532,
        cost: 25.75426,
        currency_type: "dollar",
        latency: 2342
      },
      k8s_endpoint_id: 1,
      id: 47
    }
  ],
  k8sEndpoints: [
    {
      location_id: 9,
      id: 1,
      name: "paas-cloud1"
    }
  ],
  sla: {
    error_rate: 95.0,
    cost: 600.0,
    currency_type: "dollar",
    latency: 3000
  }
};

var dryrun_base_plan = [
  {
    name: "mysql",
    containers: [
      {
        memory: 1024.0,
        name: "mysql",
        cpu: 1.0
      }
    ],
    pod_replicas: 1
  },
  {
    name: "web",
    containers: [
      {
        memory: 1024.0,
        name: "web",
        cpu: 1.0
      }
    ],
    pod_replicas: 1
  }
];

exports.sample_blueprint = sample_blueprint;
exports.dryrun_result = dryrun_result;
exports.dryrun_base_plan = dryrun_base_plan;
