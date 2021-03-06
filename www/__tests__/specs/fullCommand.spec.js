import jsonFormat from 'json-format'
import { fullCommand } from '../../parsers/fullCommand/parse'
import { compileToProps } from '../../parsers/fullCommand'

it('"1 or 4, 2" parses correctly', () => {
  const tree = fullCommand.run('1 or 4, 2')
  expect(tree).toMatchSnapshot()
})

it('"1+3" successfully parses', () => {
  expect(fullCommand.run('1+3').error).toBeFalsy()
})

it('"1+3, when hit 2+1" successfully parses', () => {
  expect(fullCommand.run('1+3, when hit 2+1').error).toBeFalsy()
})

it('"1+3*, when hit 2+1*" successfully parses', () => {
  expect(fullCommand.run('1+3*, when hit 2+1 * ').error).toBeFalsy()
})

it('"3*" successfully parses', () => {
  expect(fullCommand.run('3*').error).toBeFalsy()
})

it('"1+3, when hit 2+1" parses correctly', () => {
  const tree = fullCommand.run('1+3, when hit 2+1')
  expect(tree).toMatchSnapshot()
})

it('"1+3 (cancel) or 1" parses correctly', () => {
  const tree = fullCommand.run('1+3 (cancel) or 1')
  expect(tree).toMatchSnapshot()
})

it('"1+3 (cancel)" parses correctly', () => {
  const tree = fullCommand.run('1+3 (cancel)')
  expect(tree).toMatchSnapshot()
})

it('"dmn in rage 2+4, 1~4+3, 1 or 1" parses correctly', () => {
  const tree = fullCommand.run('dmn in rage 2+4, 1~4+3, 1 or 1')
  expect(tree).toMatchSnapshot()
})

it('"dmn in rage 2, 1+4 or 1" parses correctly', () => {
  const tree = fullCommand.run('dmn in rage 2, 1+4 or 1')
  expect(tree).toMatchSnapshot()
})

it('"rss in rage 2, 1 or 1" parses correctly', () => {
  const tree = fullCommand.run('rss in rage 2, 1 or 1')
  expect(tree).toMatchSnapshot()
})

it('"in rage DMN 2, 1" parses correctly', () => {
  const tree = fullCommand.run('in rage DMN 2, 1')
  expect(tree).toMatchSnapshot()
})

it('"jump 2, 1" parses correctly', () => {
  const tree = fullCommand.run('jump 2, 1')
  expect(tree).toMatchSnapshot()
})

it('" 2, 1" parses correctly', () => {
  const tree = fullCommand.run(' 2, 1')
  expect(tree).toMatchSnapshot()
})

it('"DMN jump rage 2, 1" parses correctly', () => {
  const tree = fullCommand.run('DMN jump rage 2, 1')
  expect(tree).toMatchSnapshot()
})

it('"DMN jump rage u/b+2, 1" parses correctly', () => {
  const tree = fullCommand.run('DMN jump rage u/b+2, 1')
  expect(tree).toMatchSnapshot()
})

it('"DMN jump rage U/B+2, 1" parses correctly', () => {
  const tree = fullCommand.run('DMN jump rage U/B+2, 1')
  expect(tree).toMatchSnapshot()
})

it('"Ws+3" parses correctly', () => {
  const tree = fullCommand.run('Ws+3').result
  expect(tree).toBeTruthy()
  expect(tree).toMatchSnapshot()
})

it('"1+5" should error', () => {
  expect(fullCommand.run('1+5').error).toBeTruthy()
  expect(fullCommand.run('1+5').error).toMatchSnapshot()
})

it('"4+" should error', () => {
  expect(fullCommand.run('4+').error).toBeTruthy()
  expect(fullCommand.run('4+').error).toMatchSnapshot()
})

it('"4~, 2" should error', () => {
  expect(fullCommand.run('4~, 2').error).toBeTruthy()
  expect(fullCommand.run('4~, 2').error).toMatchSnapshot()
})

it('"1  + (cancel) or 1" should error', () => {
  expect(fullCommand.run('1  + (cancel) or 1').error).toBeTruthy()
  expect(fullCommand.run('1  + (cancel) or 1').error).toMatchSnapshot()
})

it('"rssin rage 2, 1 or 1" should error', () => {
  expect(fullCommand.run('rssin rage 2, 1 or 1').error).toBeTruthy()
  expect(fullCommand.run('rssin rage 2, 1 or 1').error).toMatchSnapshot()
})

it('"1, 3 in rage" should error', () => {
  expect(fullCommand.run('1, 3 in rage').error).toBeTruthy()
  expect(fullCommand.run('1, 3 in rage').error).toMatchSnapshot()
})

it('"1+5, asdf" should error', () => {
  expect(fullCommand.run('1+5, asdf').error).toBeTruthy()
  expect(fullCommand.run('1+5, asdf').error).toMatchSnapshot()
})

it('"1+4, asdf" should error', () => {
  expect(fullCommand.run('1+4, asdf').error).toBeTruthy()
  expect(fullCommand.run('1+4, asdf').error).toMatchSnapshot()
})

it('"adf 1, 3 in rage" should error', () => {
  expect(fullCommand.run('adf 1, 3 in rage').error).toBeTruthy()
  expect(fullCommand.run('adf 1, 3 in rage').error).toMatchSnapshot()
})

it('"dmn in rage 2, 1+4 asdf or 1" should error', () => {
  expect(fullCommand.run('dmn in rage 2, 1+4 asdf or 1').error).toBeTruthy()
  expect(fullCommand.run('dmn in rage 2, 1+4 asdf or 1').error).toMatchSnapshot()
})

it('"dmn in rage 2,, 1+4 or 1" should error', () => {
  expect(fullCommand.run('dmn in rage 2,, 1+4 or 1').error).toBeTruthy()
  expect(fullCommand.run('dmn in rage 2,, 1+4 or 1').error).toMatchSnapshot()
})

it('"in rage " should error', () => {
  expect(fullCommand.run('in rage ').error).toBeTruthy()
  expect(fullCommand.run('in rage ').error).toMatchSnapshot()
})

it('"1 (" should error', () => {
  expect(fullCommand.run('1 (').error).toBeTruthy()
  expect(fullCommand.run('1 (').error).toMatchSnapshot()
})

it('"1 (asdf)" should error', () => {
  expect(fullCommand.run('1 (asdf)').isError).toBeTruthy()
  expect(fullCommand.run('1 (asdf)').error).toMatchSnapshot()
})

it('"1 (far)asdf" should error', () => {
  expect(fullCommand.run('1 (far)asdf').isError).toBeTruthy()
  expect(fullCommand.run('1 (asdf)').error).toMatchSnapshot()
})

it('"1+2" should compile to props correctly', () => {
  const tree = fullCommand.run('1+2').result
  expect(compileToProps(tree)).toMatchSnapshot()
})

it('"jump in rage 1+2* or when hit F+f+d/f+4, 2 (close)" should compile to props correctly', () => {
  const tree = fullCommand.run('jump in rage 1+2* or when hit F+f+d/f+4, 2 (close)').result
  expect(compileToProps(tree)).toMatchSnapshot()
})

it('"Ws+3" should compile to props correctly', () => {
  const tree = fullCommand.run('Ws+3').result // ?
  expect(compileToProps(tree)).toMatchSnapshot()
})

it('"hcb+3" should compile to props correctly', () => {
  const tree = fullCommand.run('hcb+3').result
  expect(compileToProps(tree)).toMatchSnapshot()
})

it('"hcb" should compile to props correctly', () => {
  const tree = fullCommand.run('hcb').result
  expect(compileToProps(tree)).toMatchSnapshot()
})
