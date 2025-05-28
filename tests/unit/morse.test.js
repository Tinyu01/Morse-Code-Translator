const { morse } = require('../../src/script.js');

describe('Morse Code Translator', () => {
    test('encodes text to Morse', () => {
        expect(morse.encode('SOS')).toBe('... --- ...');
        expect(morse.encode('HELLO')).toBe('.... . .-.. .-.. ---');
        expect(morse.encode('123')).toBe('.---- ..--- ...--');
    });

    test('decodes Morse to text', () => {
        expect(morse.decode('... --- ...')).toBe('SOS');
        expect(morse.decode('.... . .-.. .-.. ---')).toBe('HELLO');
        expect(morse.decode('.---- ..--- ...--')).toBe('123');
    });

    test('handles spaces correctly', () => {
        expect(morse.encode('HI THERE')).toBe('.... .. / - .... . .-. .');
        expect(morse.decode('.... .. / - .... . .-. .')).toBe('HI THERE');
    });
});