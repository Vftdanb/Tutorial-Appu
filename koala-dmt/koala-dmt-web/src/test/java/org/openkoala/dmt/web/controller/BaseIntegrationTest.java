package org.openkoala.dmt.web.controller;

import org.dayatang.domain.InstanceFactory;
import org.dayatang.ioc.spring.factory.SpringInstanceProvider;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
//import org.springframework.transaction.annotation.Propagation;
//import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringJUnit4ClassRunner.class)
//@Transactional(propagation = Propagation.REQUIRED)
@ContextConfiguration(locations = {"classpath*:META-INF/spring/root.xml"})
@TransactionConfiguration(transactionManager = "transactionManager_dmt", defaultRollback = true) 
public abstract class BaseIntegrationTest extends AbstractTransactionalJUnit4SpringContextTests {
	
    @Before
    public void setup() {
        InstanceFactory.setInstanceProvider(new SpringInstanceProvider(applicationContext));
    }

}
