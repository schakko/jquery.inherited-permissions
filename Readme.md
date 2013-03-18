Inherited permissions for jQuery
================================
This plug-in can be used to build a simple permission hierarchy with inheritance of privileges. 
Roles are not directly supported, but you can use some naming conventions for building such a concept.

The usage is very simple:
	
	var perms = new $.inheritedPermissions()

	// add permission READ to root hierarchy; root is the top node and can not be deleted
	perms.grant("READ")
	
	// add new context (sub hierarchy) below root context
	perms.addContext("subcontext", "WRITE")
	
	// change current context from "root" to "subcontext"
	perms.setCurrentContext("subcontext")
	
	// check if READ exists (it does, because of inheritance from root to subcontext
	if (perms.available("READ")) { alert("OK!") }
	
	// remove context
	perms.removeContext("subcontext")
	
	// current context will be set to root context again
	if (perms.currentContext().permissions[0] == "READ") { alert("OK!") }

	// create a new context under context "A" and switch to new context
	perms.update(["PERM_1", "PERM_2"], "B", "A")
	
License
=======
Take-it-or-leave-it-license.
