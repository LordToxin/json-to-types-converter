/**
 * Unit Test Suite for JSON to Types Converter (TypeForge)
 */
const assert = require('assert');
const generator = require('../js/type-generator.js');
const samples = require('../js/samples.js');

let passCount = 0;
let failCount = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
}

console.log('--- RUNNING TYPEFORGE TEST SUITE ---');

const testPayload = {
  id: 'usr_102',
  age: 32,
  isActive: true,
  tags: ['admin', 'verified'],
  profile: {
    avatar: 'https://img.com/avatar.png',
    bio: 'Software engineer'
  }
};

it('generates valid TypeScript interfaces and nested types', () => {
  const ts = generator.toTypeScript(testPayload, { rootName: 'User' });
  assert(ts.includes('export interface User {'), 'Must define User interface');
  assert(ts.includes('id: string;'), 'Must type id as string');
  assert(ts.includes('age: number;'), 'Must type age as number');
  assert(ts.includes('isActive: boolean;'), 'Must type isActive as boolean');
  assert(ts.includes('tags: string[];'), 'Must type tags as string array');
  assert(ts.includes('profile: UserProfile;'), 'Must link nested profile interface');
});

it('generates valid Go structs with tags', () => {
  const go = generator.toGo(testPayload, { rootName: 'User' });
  assert(go.includes('type User struct {'), 'Must declare type User struct');
  assert(go.includes('Id string `json:"id"`'), 'Must tag id field');
  assert(go.includes('Age int64 `json:"age"`'), 'Must type integer as int64');
  assert(go.includes('IsActive bool `json:"isActive"`'), 'Must type boolean as bool');
  assert(go.includes('Tags []string `json:"tags"`'), 'Must type string slice');
});

it('generates valid Rust Serde structs', () => {
  const rust = generator.toRust(testPayload, { rootName: 'User' });
  assert(rust.includes('#[derive('), 'Must include serde derive macro');
  assert(rust.includes('pub struct User {'), 'Must declare pub struct User');
  assert(rust.includes('pub id: String,'), 'Must map id to String');
  assert(rust.includes('pub is_active: bool,'), 'Must convert camelCase to snake_case');
  assert(rust.includes('pub tags: Vec<String>,'), 'Must use Vec<String>');
});

it('generates Python Pydantic v2 models', () => {
  const py = generator.toPython(testPayload, { rootName: 'User' });
  assert(py.includes('from pydantic import BaseModel, Field'), 'Must import BaseModel');
  assert(py.includes('class User(BaseModel):'), 'Must declare class User(BaseModel)');
  assert(py.includes('id: str'), 'Must type id as str');
  assert(py.includes('is_active: bool = Field(alias="isActive")'), 'Must alias camelCase fields');
  assert(py.includes('tags: List[str]'), 'Must type tags as List[str]');
});

it('generates C# models with System.Text.Json attributes', () => {
  const cs = generator.toCSharp(testPayload, { rootName: 'User' });
  assert(cs.includes('using System.Text.Json.Serialization;'), 'Must include json namespace');
  assert(cs.includes('public class User'), 'Must declare public class User');
  assert(cs.includes('[JsonPropertyName("isActive")]'), 'Must annotate JsonPropertyName');
  assert(cs.includes('public bool? IsActive { get; set; }'), 'Must declare nullable property');
});

it('generates compliant JSON Schema draft-07', () => {
  const schemaStr = generator.toJsonSchema(testPayload, 'User');
  const schema = JSON.parse(schemaStr);
  assert.strictEqual(schema.$schema, 'http://json-schema.org/draft-07/schema#');
  assert.strictEqual(schema.title, 'User');
  assert.strictEqual(schema.properties.id.type, 'string');
  assert.strictEqual(schema.properties.age.type, 'integer');
  assert.strictEqual(schema.properties.isActive.type, 'boolean');
});

it('synthesizes mock data variations', () => {
  const mocks = generator.generateMockData(testPayload, 3);
  assert.strictEqual(mocks.length, 3, 'Must generate 3 mock items');
  assert(mocks[0].id.startsWith('usr_102_'), 'Must randomize string');
  assert(typeof mocks[0].age === 'number', 'Age must remain number');
});

it('analyzes payload structure statistics', () => {
  const stats = generator.analyzeStats(testPayload);
  assert(stats.totalKeys >= 6, 'Must count at least 6 keys');
  assert(stats.maxDepth >= 2, 'Depth must be at least 2');
  assert(stats.bytes > 50, 'Payload size must be > 50 bytes');
});

it('verifies all preloaded API samples convert across all languages without exceptions', () => {
  for (const [key, sample] of Object.entries(samples.SAMPLES)) {
    const ts = generator.toTypeScript(sample.data);
    const go = generator.toGo(sample.data);
    const rust = generator.toRust(sample.data);
    const py = generator.toPython(sample.data);
    const cs = generator.toCSharp(sample.data);

    assert(ts.length > 50, `TS generation for ${key} must succeed`);
    assert(go.length > 50, `Go generation for ${key} must succeed`);
    assert(rust.length > 50, `Rust generation for ${key} must succeed`);
    assert(py.length > 50, `Python generation for ${key} must succeed`);
    assert(cs.length > 50, `C# generation for ${key} must succeed`);
  }
});

console.log(`\nTest results: ${passCount} passed, ${failCount} failed.`);
if (failCount > 0) {
  process.exit(1);
} else {
  console.log('All TypeForge tests passed successfully! ✨');
}
