class Frag
{
	constructor()
	{
		this.contents = [];
	}

	append(/*...*/)
	{
		for(const a in arguments)
		{
			this.contents.push(a);
		}
	}
}

class ElementWrapper
{
	constructor(element)
	{
		this._ = element
	}

	append(/*...*/)
	{
		for(const a of arguments)
		{
			this.append_one(a);
		}
	}	
	
	append_one(a)
	{
		if (a instanceof ElementWrapper)
		{
			// A Element instance (Browser’s DOM object)
			this._.append(a._);
		}
		else if (a instanceof Element || a instanceof String)
		{
			// Object of one of our HTMLElement classes.
			this._.append(a);
		}
		else if ( a instanceof Object )
		{
			// A paramter object. Use keys as attribute names. “class” is
			// a special case.
			for (let key in a)
			{
				const value = a[key];
				if ("key" == "class")
				{
					this.apply_class(value)
				}
				else
				{
					const attr_name = key.replace("_", "-");
					this._.setAttribute(attr_name, value);
				}
			}
		}
		else if ( a instanceof Frag )
		{
			for ( const b of a.contents )
			{
				this.append(b);
			}
		}
		else if ( a === null )
		{
			// pass
		}
		else
		{
			this._.append(a.toString());
		}
	}

	append_to(parent)
	{
		if (parent instanceof Element)
		{
			parent.append(this._);
		}
		else if (parent instanceof ElementWrapper)
		{
			parent._.append(this._);
		}
		else
		{
			throw "Type Error: can only append to Element or HTMLElement";
		}
	}
	
	apply_class(value)
	{
		if (value instanceof Array)
		{
			for (let a in value)
			{
				this._.classList.add(a);
			}
		}
		else if (value instanceof String)
		{
			this._.setAttribute("class", value);
		}
	}
}

class HTMLElement extends ElementWrapper
{
	constructor(tag)
	{
		super(document.createElement(tag.toUpperCase()));
		
		for (let a = 1; a < arguments.length; a++)
		{
			this.append(arguments[a]);
		}		
	}
}

class Wrapper extends ElementWrapper
{
	constructor(element)
	{
		super(element);
	}
}

// From https://developer.mozilla.org/en-US/docs/Web/HTML/Element
// I’ve removed tags marked as depricated (who’d want to use those??) and
// experimantal.
const alltags = "a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd label legend li link main map mark menu meta meter nav noscript object ol optgroup option output p picture pre progress q rp rt ruby s samp script search section select slot small source span strong style sub summary sup table tbody td template textarea tfoot th thead time title tr track u ul var video wbr".split(" ");

function namespace() {
	for (const tag of alltags)
	{
		this[tag] = function()
		{
			return new HTMLElement(tag, ...arguments)
		};
	}

	this.Frag = function()
	{
		const frag = new Frag();
		
		for(const a in arguments)
		{
			frag.append(a);
		}
	}

	this.Wrapper = function(e)
	{
		return new Wrapper(e);
	}
}

const html = new namespace();

export { html };
