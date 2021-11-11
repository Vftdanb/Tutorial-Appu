package org.openkoala.dmt.utils;

import static org.junit.Assert.*;

import org.junit.Test;

public class UpperUnderscoreStringConvertorTest {

	@Test
	public void testGeneratorTablename() {
		UpperUnderscoreConvertor tableNameGenerator = new UpperUnderscoreConvertor("TestClassName");
		assertEquals("TEST_CLASS_NAME", tableNameGenerator.convert());

		UpperUnderscoreConvertor tableNameGenerator1 = new UpperUnderscoreConvertor("testClassName");
		assertEquals("TEST_CLASS_NAME", tableNameGenerator1.convert());

		UpperUnderscoreConvertor tableNameGenerator2 = new UpperUnderscoreConvertor("Test_Class_Name");
		assertEquals("TEST_CLASS_NAME", tableNameGenerator2.convert());

		UpperUnderscoreConvertor tableNameGenerator3 = new UpperUnderscoreConvertor("TestClassName1");
		assertEquals("TEST_CLASS_NAME1", tableNameGenerator3.convert());

		UpperUnderscoreConvertor tableNameGenerator4 = new UpperUnderscoreConvertor("Test2ClassName");
		assertEquals("TEST2_CLASS_NAME", tableNameGenerator4.convert());
}

}
