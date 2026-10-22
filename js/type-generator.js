/**
 * TypeForge Core Engine - JSON to Multi-Language Type Synthesizer
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TypeGenerator = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function toPascalCase(str) {
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[a-z]/, chr => chr.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, '') || 'Item';
  }

  function toCamelCase(str) {
    const p = toPascalCase(str);
    return p.charAt(0).toLowerCase() + p.slice(1);
  }

  function toSnakeCase(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .toLowerCase()
      .replace(/^_+|_+$/g, '') || 'item';
  }

  function getType(val) {
    if (val === null) return 'null';
    if (Array.isArray(val)) return 'array';
    return typeof val;
  }

  /**
   * Deeply inspects an object or array to build a unified schema map
   */
  function inspectSchema(data, typeName = 'Root') {
    const type = getType(data);
    if (type === 'null') {
      return { type: 'null', typeName };
    }
    if (type === 'array') {
      if (data.length === 0) {
        return { type: 'array', itemType: { type: 'any', typeName: `${typeName}Item` }, typeName };
      }
      // Merge all items in array
      const mergedFields = {};
      const fieldOccurrences = {};
      let hasPrimitive = false;
      let primitiveType = null;

      data.forEach(item => {
        const itemType = getType(item);
        if (itemType === 'object' && item !== null) {
          Object.keys(item).forEach(k => {
            fieldOccurrences[k] = (fieldOccurrences[k] || 0) + 1;
            if (!mergedFields[k]) {
              mergedFields[k] = inspectSchema(item[k], toPascalCase(k));
            }
          });
        } else {
          hasPrimitive = true;
          primitiveType = itemType;
        }
      });

      if (!hasPrimitive && Object.keys(mergedFields).length > 0) {
        // Mark optional if not in all items
        Object.keys(mergedFields).forEach(k => {
          if (fieldOccurrences[k] < data.length) {
            mergedFields[k].optional = true;
          }
        });
        return {
          type: 'array',
          itemType: { type: 'object', fields: mergedFields, typeName: `${typeName}Item` },
          typeName
        };
      } else {
        return {
          type: 'array',
          itemType: inspectSchema(data[0], `${typeName}Item`),
          typeName
        };
      }
    }

    if (type === 'object') {
      const fields = {};
      Object.keys(data).forEach(k => {
        fields[k] = inspectSchema(data[k], toPascalCase(k));
      });
      return { type: 'object', fields, typeName };
    }

    return { type, typeName };
  }

  /**
   * TypeScript Generator
   */
  function toTypeScript(data, options = {}) {
    const rootName = options.rootName || 'RootObject';
    const useType = options.useTypeAlias || false;
    const schema = inspectSchema(data, rootName);
    const definitions = [];

    function generate(node, name) {
      if (node.type === 'object') {
        const lines = [];
        const keyword = useType ? `export type ${name} = {` : `export interface ${name} {`;
        lines.push(keyword);

        Object.keys(node.fields).forEach(key => {
          const field = node.fields[key];
          const opt = field.optional ? '?' : '';
          let tsType = 'any';

          if (field.type === 'string') tsType = 'string';
          else if (field.type === 'number') tsType = 'number';
          else if (field.type === 'boolean') tsType = 'boolean';
          else if (field.type === 'null') tsType = 'null | any';
          else if (field.type === 'object') {
            const nestedName = `${name}${toPascalCase(key)}`;
            generate(field, nestedName);
            tsType = nestedName;
          } else if (field.type === 'array') {
            if (field.itemType.type === 'object') {
              const nestedName = `${name}${toPascalCase(key)}Item`;
              generate(field.itemType, nestedName);
              tsType = `${nestedName}[]`;
            } else {
              const prim = field.itemType.type === 'number' ? 'number' : field.itemType.type === 'string' ? 'string' : 'any';
              tsType = `${prim}[]`;
            }
          }

          lines.push(`  ${key}${opt}: ${tsType};`);
        });

        lines.push(useType ? '};' : '}');
        definitions.push(lines.join('\n'));
      }
    }

    generate(schema, rootName);
    return definitions.reverse().join('\n\n');
  }

  /**
   * Go (Golang) Struct Generator
   */
  function toGo(data, options = {}) {
    const rootName = options.rootName || 'Root';
    const schema = inspectSchema(data, rootName);
    const definitions = [];

    function generate(node, name) {
      if (node.type === 'object') {
        const lines = [`type ${name} struct {`];
        Object.keys(node.fields).forEach(key => {
          const field = node.fields[key];
          const goFieldName = toPascalCase(key);
          let goType = 'interface{}';

          if (field.type === 'string') goType = 'string';
          else if (field.type === 'number') goType = Number.isInteger(data[key]) ? 'int64' : 'float64';
          else if (field.type === 'boolean') goType = 'bool';
          else if (field.type === 'object') {
            const nested = `${name}${goFieldName}`;
            generate(field, nested);
            goType = nested;
          } else if (field.type === 'array') {
            if (field.itemType.type === 'object') {
              const nested = `${name}${goFieldName}Item`;
              generate(field.itemType, nested);
              goType = `[]${nested}`;
            } else {
              goType = `[]${field.itemType.type === 'string' ? 'string' : 'float64'}`;
            }
          }

          lines.push(`\t${goFieldName} ${goType} \`json:"${key}${field.optional ? ',omitempty' : ''}"\``);
        });
        lines.push('}');
        definitions.push(lines.join('\n'));
      }
    }

    generate(schema, rootName);
    return definitions.reverse().join('\n\n');
  }

  /**
   * Rust Serde Struct Generator
   */
  function toRust(data, options = {}) {
    const rootName = options.rootName || 'Root';
    const schema = inspectSchema(data, rootName);
    const definitions = [];

    function generate(node, name) {
      if (node.type === 'object') {
        const lines = [
          '#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]',
          '#[serde(rename_all = "camelCase")]',
          `pub struct ${name} {`
        ];

        Object.keys(node.fields).forEach(key => {
          const field = node.fields[key];
          const rustFieldName = toSnakeCase(key);
          let rustType = 'serde_json::Value';

          if (field.type === 'string') rustType = 'String';
          else if (field.type === 'number') rustType = Number.isInteger(data[key]) ? 'i64' : 'f64';
          else if (field.type === 'boolean') rustType = 'bool';
          else if (field.type === 'object') {
            const nested = `${name}${toPascalCase(key)}`;
            generate(field, nested);
            rustType = nested;
          } else if (field.type === 'array') {
            if (field.itemType.type === 'object') {
              const nested = `${name}${toPascalCase(key)}Item`;
              generate(field.itemType, nested);
              rustType = `Vec<${nested}>`;
            } else {
              rustType = `Vec<${field.itemType.type === 'string' ? 'String' : 'f64'}>`;
            }
          }

          if (field.optional) {
            rustType = `Option<${rustType}>`;
          }

          if (rustFieldName !== key) {
            lines.push(`    #[serde(rename = "${key}")]`);
          }
          lines.push(`    pub ${rustFieldName}: ${rustType},`);
        });

        lines.push('}');
        definitions.push(lines.join('\n'));
      }
    }

    generate(schema, rootName);
    return definitions.reverse().join('\n\n');
  }

  /**
   * Python (Pydantic v2) Generator
   */
  function toPython(data, options = {}) {
    const rootName = options.rootName || 'Root';
    const schema = inspectSchema(data, rootName);
    const definitions = [];

    function generate(node, name) {
      if (node.type === 'object') {
        const lines = [`class ${name}(BaseModel):`];
        const keys = Object.keys(node.fields);
        if (keys.length === 0) {
          lines.push('    pass');
        } else {
          keys.forEach(key => {
            const field = node.fields[key];
            const pyFieldName = toSnakeCase(key);
            let pyType = 'Any';

            if (field.type === 'string') pyType = 'str';
            else if (field.type === 'number') pyType = Number.isInteger(data[key]) ? 'int' : 'float';
            else if (field.type === 'boolean') pyType = 'bool';
            else if (field.type === 'object') {
              const nested = `${name}${toPascalCase(key)}`;
              generate(field, nested);
              pyType = nested;
            } else if (field.type === 'array') {
              if (field.itemType.type === 'object') {
                const nested = `${name}${toPascalCase(key)}Item`;
                generate(field.itemType, nested);
                pyType = `List[${nested}]`;
              } else {
                pyType = `List[${field.itemType.type === 'string' ? 'str' : 'float'}]`;
              }
            }

            if (field.optional) {
              pyType = `Optional[${pyType}] = None`;
            }

            if (pyFieldName !== key) {
              lines.push(`    ${pyFieldName}: ${pyType} = Field(alias="${key}")`);
            } else {
              lines.push(`    ${pyFieldName}: ${pyType}`);
            }
          });
        }
        definitions.push(lines.join('\n'));
      }
    }

    generate(schema, rootName);
    return [
      'from typing import Optional, List, Any',
      'from pydantic import BaseModel, Field\n',
      definitions.reverse().join('\n\n')
    ].join('\n');
  }

  /**
   * C# Class Generator
   */
  function toCSharp(data, options = {}) {
    const rootName = options.rootName || 'Root';
    const schema = inspectSchema(data, rootName);
    const definitions = [];

    function generate(node, name) {
      if (node.type === 'object') {
        const lines = [`public class ${name}`, '{'];
        Object.keys(node.fields).forEach(key => {
          const field = node.fields[key];
          const csFieldName = toPascalCase(key);
          let csType = 'object';

          if (field.type === 'string') csType = 'string';
          else if (field.type === 'number') csType = Number.isInteger(data[key]) ? 'long' : 'double';
          else if (field.type === 'boolean') csType = 'bool';
          else if (field.type === 'object') {
            const nested = `${name}${csFieldName}`;
            generate(field, nested);
            csType = nested;
          } else if (field.type === 'array') {
            if (field.itemType.type === 'object') {
              const nested = `${name}${csFieldName}Item`;
              generate(field.itemType, nested);
              csType = `List<${nested}>`;
            } else {
              csType = `List<${field.itemType.type === 'string' ? 'string' : 'double'}>`;
            }
          }

          lines.push(`    [JsonPropertyName("${key}")]`);
          lines.push(`    public ${csType}? ${csFieldName} { get; set; }\n`);
        });
        lines.push('}');
        definitions.push(lines.join('\n'));
      }
    }

    generate(schema, rootName);
    return [
      'using System.Collections.Generic;',
      'using System.Text.Json.Serialization;\n',
      definitions.reverse().join('\n\n')
    ].join('\n');
  }

  /**
   * JSON Schema Draft-07 Generator
   */
  function toJsonSchema(data, title = 'Root') {
    function build(val, nodeTitle) {
      const type = getType(val);
      if (type === 'null') return { type: 'null' };
      if (type === 'string') return { type: 'string' };
      if (type === 'number') return { type: Number.isInteger(val) ? 'integer' : 'number' };
      if (type === 'boolean') return { type: 'boolean' };
      if (type === 'array') {
        return {
          type: 'array',
          items: val.length > 0 ? build(val[0], `${nodeTitle}Item`) : {}
        };
      }
      if (type === 'object') {
        const properties = {};
        const required = Object.keys(val);
        Object.keys(val).forEach(k => {
          properties[k] = build(val[k], k);
        });
        return {
          type: 'object',
          title: nodeTitle,
          properties,
          required
        };
      }
      return {};
    }

    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      ...build(data, title)
    };
    return JSON.stringify(schema, null, 2);
  }

  /**
   * Synthesizes 3-5 randomized mock items based on the data structure
   */
  function generateMockData(sample, count = 3) {
    const mocks = [];
    for (let i = 0; i < count; i++) {
      mocks.push(cloneAndRandomize(sample, i + 1));
    }
    return mocks;
  }

  function cloneAndRandomize(obj, seed) {
    if (obj === null || typeof obj !== 'object') {
      if (typeof obj === 'number') return Math.round(obj * (0.8 + Math.random() * 0.4));
      if (typeof obj === 'string') return `${obj}_${seed}`;
      if (typeof obj === 'boolean') return Math.random() > 0.5;
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(item => cloneAndRandomize(item, seed));
    }
    const res = {};
    Object.keys(obj).forEach(k => {
      res[k] = cloneAndRandomize(obj[k], seed);
    });
    return res;
  }

  /**
   * Calculates structure stats
   */
  function analyzeStats(data) {
    let keyCount = 0;
    let maxDepth = 0;

    function walk(node, depth) {
      maxDepth = Math.max(maxDepth, depth);
      if (node && typeof node === 'object') {
        if (Array.isArray(node)) {
          node.forEach(item => walk(item, depth + 1));
        } else {
          Object.keys(node).forEach(k => {
            keyCount++;
            walk(node[k], depth + 1);
          });
        }
      }
    }

    walk(data, 1);
    const jsonStr = JSON.stringify(data);
    const bytes = new Blob ? new Blob([jsonStr]).size : Buffer.byteLength(jsonStr, 'utf8');

    return {
      totalKeys: keyCount,
      maxDepth: maxDepth,
      bytes: bytes,
      formattedSize: bytes > 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`
    };
  }

  return {
    toTypeScript,
    toGo,
    toRust,
    toPython,
    toCSharp,
    toJsonSchema,
    generateMockData,
    analyzeStats,
    toPascalCase,
    toSnakeCase,
    toCamelCase
  };
});
