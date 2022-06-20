/* tracing-aspecto.js */
"use strict";

// OpenTelemetry
const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { trace } = require("@opentelemetry/api");

// Exporter
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");

// Instrumentation
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { KafkaJsInstrumentation } = require("opentelemetry-instrumentation-kafkajs");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { ExpressInstrumentation } = require("opentelemetry-instrumentation-express");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");

module.exports = (serviceName) => {
  const exporter = new OTLPTraceExporter({
    url: "https://collector.aspecto.io/v1/traces",
    headers: {
      Authorization: process.env.ASPECTO_API_KEY,
    },
  });

  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName
    }),
    // plugins: {
    //   kafkajs: { enabled: false, path: 'opentelemetry-plugin-kafkajs' }
    // }
  });
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  provider.register();

  registerInstrumentations({
    instrumentations: [
      getNodeAutoInstrumentations(),
      new KafkaJsInstrumentation({}),
      new HttpInstrumentation(),
      new ExpressInstrumentation({
        requestHook: (span, requestInfo) => {
          // span.setAttribute("http.request.body",JSON.stringify(requestInfo.req.body));
          span.setAttribute("request-headers",JSON.stringify(requestInfo.req.headers));
        },
      }),
    ],
    tracerProvider: provider,
  });
  return trace.getTracer(serviceName);
};

// "Some problems are so complex that you have to be highly intelligent and well informed just to be undecided about them." - Laurence J. Peter