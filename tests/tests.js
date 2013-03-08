test("default context is root", function() {
	var plugin = $.inheritedPermissions()
	ok(plugin.currentContext() !== null)
	ok(plugin.currentContext().parent == null)
	ok(plugin.currentContext().permissions.length == 0)
})

test("get context by name", function() {
	var plugin = $.inheritedPermissions()
	ok(plugin.get("root") !== null)
	ok(plugin.get("root").permissions.length == 0)
})

test("grant permission in default context and check availability", function() {
	var plugin = $.inheritedPermissions()
	
	plugin.grant("TEST_PERM")
	
	ok(plugin.available("TEST_PERM") == true)
})

test("revoke permission from default context", function() {
	var plugin = $.inheritedPermissions()
	
	plugin.grant("TEST_PERM")
	plugin.revoke("TEST_PERM")
	
	ok(plugin.available("TEST_PERM") == false)
})

test("add new context on same level as root", function() {
	var plugin = $.inheritedPermissions()
	
	plugin.addContext("system", "TEST_PERM")
	
	var r = plugin.get("system")
	
	ok(r !== null)
	ok(r.permissions[0] === "TEST_PERM")
	
	// root still exists
	r = plugin.get("root")
	ok(r !== null)
})

test("fail on adding context if parent does not exist", function() {
	var plugin = $.inheritedPermissions()
	
	try 
	{
		plugin.addContext("system", "TEST_PERM", "void")
		
		var r = plugin.get("system")
		fail("system should not exist")
	}
	catch (ex)
	{
		ok(true)
	}
})

test("root context removal is not allowed", function() {
	var plugin = $.inheritedPermissions()
	
	try
	{
		plugin.removeContext("root")
	}
	catch (ex)
	{
		ok(true)
	}
})

test("child context can be added", function() {
	var plugin = $.inheritedPermissions()
	
	// grant root hierarchy permissions
	plugin.grant("ROOT_PERM")
	plugin.addContext("system", "TEST_PERM", "root")
	var r = plugin.get("system")
	
	ok(r.parent !== null)
	ok(r.parent.permissions[0] === "ROOT_PERM")
})

test("permissions are aggregated", function() {
	var plugin = $.inheritedPermissions()
	
	// grant root hierarchy permissions
	plugin.grant("ROOT_PERM")
	plugin.addContext("system", "CHILD_PERM", "root")
	
	ok(plugin.available("CHILD_PERM") === false /** still in root context */)
	plugin.setCurrentContext("system")
	ok(plugin.available("CHILD_PERM") === true /** system context */)
})

test("remove child levels", function() {
	var plugin  = $.inheritedPermissions()
	
	plugin.grant("ROOT_PERM")
	plugin.addContext("level1", "LEVEL1_PERM", "root")
	plugin.addContext("level2", "LEVEL2_PERM", "level1");
	
	ok(plugin.available("ROOT_PERM", "level2"))
	
	plugin.removeContext("level1")
	
	try {
		plugin.get("level2")
		ok(false)
	}
	catch (ex)
	{
		ok(true)
	}
	
	try {
		plugin.get("level1")
		ok(false)
	}
	catch (ex)
	{
		ok(true)
	}
})

test("assert that current context will be resetted if current context is deleted", function() {
	var plugin  = $.inheritedPermissions()
	
	plugin.grant("ROOT_PERM")
	plugin.addContext("level1", "LEVEL1_PERM", "root")
	plugin.addContext("level2", "LEVEL2_PERM", "level1");
	plugin.setCurrentContext("level2")
	
	plugin.removeContext("level1")
	var r = plugin.currentContext()
	
	ok(r.permissions[0] == "ROOT_PERM")
})

test("assert that current context will be resetted to root if deleted context is on the same level with root", function() {
	var plugin  = $.inheritedPermissions()
	
	plugin.grant("ROOT_PERM")
	plugin.addContext("root2", "ROOT2_PERM")
	plugin.setCurrentContext("root2")
	
	plugin.removeContext("root2")
	var r = plugin.currentContext()
	
	ok(r.permissions[0] == "ROOT_PERM")
})
